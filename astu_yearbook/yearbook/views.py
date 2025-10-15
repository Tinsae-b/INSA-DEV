# yearbook/views.py (updated with security enhancements)
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.http import FileResponse, JsonResponse
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import connection
import os
from .models import *
from .serializers import *
from .pagination import SmallResultsPagination, LargeResultsPagination
from django_filters.rest_framework import DjangoFilterBackend
from .security import (
    sanitize_html_input, 
    sanitize_filename, 
    validate_image_file,
    log_security_event,
    rate_limit_api
)
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

# Health check endpoint for monitoring
@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for container orchestration and monitoring.
    Returns 200 if all critical services are operational.
    """
    health_status = {
        'status': 'healthy',
        'database': 'unknown',
        'media_storage': 'unknown',
    }
    status_code = 200
    
    # Check database connection
    try:
        connection.ensure_connection()
        health_status['database'] = 'connected'
    except Exception as e:
        health_status['status'] = 'unhealthy'
        health_status['database'] = f'error: {str(e)}'
        status_code = 503
    
    # Check media storage
    try:
        if os.path.exists(settings.MEDIA_ROOT):
            health_status['media_storage'] = 'accessible'
        else:
            health_status['media_storage'] = 'not found'
            health_status['status'] = 'degraded'
    except Exception as e:
        health_status['media_storage'] = f'error: {str(e)}'
        if health_status['status'] == 'healthy':
            health_status['status'] = 'degraded'
    
    return JsonResponse(health_status, status=status_code)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().prefetch_related('students')
    serializer_class = DepartmentSerializer
    pagination_class = SmallResultsPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

@method_decorator(ratelimit(key='ip', rate='200/h', method='GET'), name='list')
@method_decorator(ratelimit(key='ip', rate='50/h', method='POST'), name='create')
class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    pagination_class = LargeResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'is_featured']
    search_fields = ['name', 'quote', 'last_words']
    queryset = Student.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset().select_related('department')
        
        # Custom filtering for featured students with validation
        is_featured = self.request.query_params.get('is_featured')
        if is_featured and is_featured in ['true', '1', 'True']:
            queryset = queryset.filter(is_featured=True)
        elif is_featured and is_featured in ['false', '0', 'False']:
            queryset = queryset.filter(is_featured=False)
            
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        """Validate and sanitize data before creating student"""
        # Sanitize text fields
        validated_data = serializer.validated_data
        
        if 'quote' in validated_data:
            validated_data['quote'] = sanitize_html_input(validated_data['quote'], allowed_tags=[])
        
        if 'last_words' in validated_data:
            validated_data['last_words'] = sanitize_html_input(validated_data['last_words'], allowed_tags=[])
        
        # Validate image if provided
        if 'photo' in validated_data:
            try:
                validate_image_file(validated_data['photo'])
            except ValidationError as e:
                log_security_event('invalid_file_upload', str(e), self.request)
                raise
        
        serializer.save()
    
    def perform_update(self, serializer):
        """Validate and sanitize data before updating student"""
        validated_data = serializer.validated_data
        
        if 'quote' in validated_data:
            validated_data['quote'] = sanitize_html_input(validated_data['quote'], allowed_tags=[])
        
        if 'last_words' in validated_data:
            validated_data['last_words'] = sanitize_html_input(validated_data['last_words'], allowed_tags=[])
        
        if 'photo' in validated_data:
            try:
                validate_image_file(validated_data['photo'])
            except ValidationError as e:
                log_security_event('invalid_file_upload', str(e), self.request)
                raise
        
        serializer.save()
    
    @action(detail=True, methods=['get'])
    def certificate(self, request, pk=None):
        """
        Generate and return certificate for a student
        """
        student = self.get_object()
        try:
            certificate_path = student.get_certificate_url()
            if certificate_path:
                # Security: Validate path to prevent directory traversal
                full_path = os.path.join(settings.MEDIA_ROOT, certificate_path)
                full_path = os.path.abspath(full_path)
                
                # Ensure the file is within MEDIA_ROOT
                if not full_path.startswith(os.path.abspath(settings.MEDIA_ROOT)):
                    log_security_event('path_traversal_attempt', 
                                     f'Attempted access to: {certificate_path}', 
                                     request, 'ERROR')
                    return Response(
                        {'error': 'Invalid file path'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                if os.path.exists(full_path):
                    # Sanitize filename
                    safe_filename = sanitize_filename(f'{student.student_id}_certificate.png')
                    
                    # Open file and create proper FileResponse
                    file_handle = open(full_path, 'rb')
                    response = FileResponse(
                        file_handle,
                        content_type='image/png',
                        filename=safe_filename
                    )
                    response['Content-Disposition'] = f'inline; filename="{safe_filename}"'
                    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                    response['Pragma'] = 'no-cache'
                    response['Expires'] = '0'
                    return response
                else:
                    return Response(
                        {'error': 'Certificate not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                return Response(
                    {'error': 'Failed to generate certificate'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            return Response(
                {'error': f'Error generating certificate: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FacultyTributeViewSet(viewsets.ModelViewSet):
    queryset = FacultyTribute.objects.all().order_by('order')
    serializer_class = FacultyTributeSerializer
    pagination_class = SmallResultsPagination


class MemoryCategoryViewSet(viewsets.ModelViewSet):
    queryset = MemoryCategory.objects.filter(is_active=True).all()
    serializer_class = MemoryCategorySerializer
    pagination_class = SmallResultsPagination


@method_decorator(ratelimit(key='ip', rate='100/h', method='GET'), name='list')
@method_decorator(ratelimit(key='ip', rate='30/h', method='POST'), name='create')
class MemoryBoardViewSet(viewsets.ModelViewSet):
    queryset = MemoryBoard.objects.select_related('department', 'category').all()
    serializer_class = MemoryBoardSerializer
    pagination_class = SmallResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'category', 'memory_type']
    search_fields = ['title', 'caption', 'author_name', 'author_program', 'author_year']
    
    def perform_create(self, serializer):
        """Validate and sanitize memory board data"""
        validated_data = serializer.validated_data
        
        # Sanitize text fields
        if 'title' in validated_data:
            validated_data['title'] = sanitize_html_input(validated_data['title'], allowed_tags=[])
        
        if 'caption' in validated_data:
            validated_data['caption'] = sanitize_html_input(validated_data['caption'], 
                                                           allowed_tags=['p', 'br', 'strong', 'em'])
        
        if 'author_name' in validated_data:
            validated_data['author_name'] = sanitize_html_input(validated_data['author_name'], allowed_tags=[])
        
        # Validate image/video uploads
        if 'image' in validated_data and validated_data['image']:
            try:
                validate_image_file(validated_data['image'])
            except ValidationError as e:
                log_security_event('invalid_file_upload', str(e), self.request)
                raise
        
        serializer.save()
    
    def perform_update(self, serializer):
        """Validate and sanitize memory board data on update"""
        validated_data = serializer.validated_data
        
        if 'title' in validated_data:
            validated_data['title'] = sanitize_html_input(validated_data['title'], allowed_tags=[])
        
        if 'caption' in validated_data:
            validated_data['caption'] = sanitize_html_input(validated_data['caption'], 
                                                           allowed_tags=['p', 'br', 'strong', 'em'])
        
        if 'author_name' in validated_data:
            validated_data['author_name'] = sanitize_html_input(validated_data['author_name'], allowed_tags=[])
        
        if 'image' in validated_data and validated_data['image']:
            try:
                validate_image_file(validated_data['image'])
            except ValidationError as e:
                log_security_event('invalid_file_upload', str(e), self.request)
                raise
        
        serializer.save()

class TraineeSuccessStoryViewSet(viewsets.ModelViewSet):
    queryset = TraineeSuccessStory.objects.select_related('department').all()
    serializer_class = TraineeSuccessStorySerializer
    pagination_class = SmallResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'graduation_year']
    search_fields = ['name', 'current_position']

class DirectorGeneralMessageViewSet(viewsets.ModelViewSet):
    serializer_class = DirectorGeneralMessageSerializer
    queryset = DirectorGeneralMessage.objects.all()

    def get_queryset(self):
        # Return only the latest message
        return super().get_queryset().order_by('-id')[:1]

class CyberTalentDirectorMessageViewSet(viewsets.ModelViewSet):
    serializer_class = CyberTalentDirectorMessageSerializer
    queryset = CyberTalentDirectorMessage.objects.all()

    def get_queryset(self):
        # Return only the latest message
        return super().get_queryset().order_by('-id')[:1]

class AboutINSAViewSet(viewsets.ModelViewSet):
    serializer_class = AboutINSASerializer
    queryset = AboutINSA.objects.all()

    def get_queryset(self):
        # Ensure we always have an AboutINSA instance
        about, _ = AboutINSA.objects.get_or_create(pk=1)
        return super().get_queryset().filter(pk=1)


class LeadershipViewSet(viewsets.ModelViewSet):
    queryset = Leadership.objects.filter(is_active=True).all()
    serializer_class = LeadershipSerializer
    pagination_class = SmallResultsPagination


# Certificate Verification View
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import cache_page
import re

@require_http_methods(["GET"])
@ratelimit(key='ip', rate='20/m', method='GET')
@cache_page(60 * 5)  # Cache for 5 minutes
def verify_certificate_view(request, student_id):
    """
    Public certificate verification page - allows anyone to verify a certificate by student ID
    Security: Rate limited, input validated, XSS protected
    """
    # Validate student_id format to prevent SQL injection and XSS
    # Student ID should be alphanumeric with possible dashes/underscores
    if not re.match(r'^[A-Za-z0-9_-]+$', student_id):
        log_security_event('invalid_student_id', 
                         f'Invalid student_id format: {student_id}', 
                         request, 'WARNING')
        return HttpResponseBadRequest('Invalid student ID format')
    
    # Limit student_id length
    if len(student_id) > 50:
        return HttpResponseBadRequest('Student ID too long')
    
    try:
        student = get_object_or_404(Student, student_id=student_id)
        certificate_path = student.get_certificate_url()
        
        if certificate_path:
            # Security: Validate path to prevent directory traversal
            full_path = os.path.join(settings.MEDIA_ROOT, certificate_path)
            full_path = os.path.abspath(full_path)
            
            # Ensure the file is within MEDIA_ROOT
            if not full_path.startswith(os.path.abspath(settings.MEDIA_ROOT)):
                log_security_event('path_traversal_attempt', 
                                 f'Certificate verification path traversal: {certificate_path}', 
                                 request, 'ERROR')
                context = {
                    'verified': False,
                    'error': 'Invalid certificate path',
                    'student_id': student_id
                }
                return render(request, 'verify_certificate.html', context)
            
            if os.path.exists(full_path):
                # Sanitize all output data to prevent XSS
                context = {
                    'verified': True,
                    'student_id': sanitize_html_input(student.student_id, allowed_tags=[]),
                    'student_name': sanitize_html_input(student.name, allowed_tags=[]),
                    'department': sanitize_html_input(student.department.name, allowed_tags=[]),
                    'certificate_url': f'/media/{certificate_path}',
                    'issue_date': student.created_at.strftime('%B %d, %Y'),
                    'quote': sanitize_html_input(student.quote if student.quote else '', allowed_tags=[]),
                }
                
                # Return HTML template
                return render(request, 'verify_certificate.html', context)
            else:
                context = {
                    'verified': False,
                    'error': 'Certificate not found',
                    'student_id': sanitize_html_input(student_id, allowed_tags=[])
                }
                return render(request, 'verify_certificate.html', context)
        else:
            context = {
                'verified': False,
                'error': 'Certificate not generated',
                'student_id': sanitize_html_input(student_id, allowed_tags=[])
            }
            return render(request, 'verify_certificate.html', context)
            
    except Student.DoesNotExist:
        context = {
            'verified': False,
            'error': 'Student not found',
            'student_id': sanitize_html_input(student_id, allowed_tags=[])
        }
        return render(request, 'verify_certificate.html', context)
    except Exception as e:
        log_security_event('certificate_verification_error', 
                         f'Error: {str(e)}', 
                         request, 'ERROR')
        context = {
            'verified': False,
            'error': 'An error occurred during verification',
            'student_id': sanitize_html_input(student_id, allowed_tags=[])
        }
        return render(request, 'verify_certificate.html', context)