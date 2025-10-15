# yearbook/serializers.py
from rest_framework import serializers
from .models import *

class ProfileImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProfileImage
        fields = ['image_url', 'caption']

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

class DepartmentSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = '__all__'
        
    def get_student_count(self, obj):
        return obj.students.count()

class StudentSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    photo_url = serializers.SerializerMethodField()
    certificate_url = serializers.SerializerMethodField()
    profile_images = ProfileImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'name', 'department', 'department_name', 'photo_url', 'certificate_url', 'quote', 'last_words', 'highlight_tagline', 'description', 'is_featured', 'created_at', 'updated_at', 'my_story', 'profile_images']
        
    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return obj.photo.url if obj.photo else None
    
    def get_certificate_url(self, obj):
        request = self.context.get('request')
        # The frontend expects the certificate endpoint under the API prefix
        # Use the request to build an absolute URI when available
        if request:
            # Note: router registers viewsets under /yearbook/api/, so the certificate action is at
            # /yearbook/api/students/{id}/certificate/
            return request.build_absolute_uri(f'/yearbook/api/students/{obj.id}/certificate/')
        # Fallback: try to use Django settings to construct a SITE_URL if provided
        from django.conf import settings
        site_url = getattr(settings, 'SITE_URL', None)
        if site_url:
            return f"{site_url.rstrip('/')}/yearbook/api/students/{obj.id}/certificate/"
        return None
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        
        # Fix profile_image URL
        if representation.get('profile_image'):
            representation['profile_image'] = request.build_absolute_uri(representation['profile_image'])
        
        # Fix profile_images URLs
        if 'profile_images' in representation:
            representation['profile_images'] = [
                request.build_absolute_uri(img) 
                for img in representation['profile_images']
            ]
        return representation

class FacultyTributeSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FacultyTribute
        fields = ['id', 'name', 'photo_url', 'message', 'position', 'order', 'department_name', 'years_of_service', 'specialization']
        
    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None

class DirectorGeneralMessageSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DirectorGeneralMessage
        fields = '__all__'
        
    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None

class CyberTalentDirectorMessageSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CyberTalentDirectorMessage
        fields = '__all__'
        
    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None

class MemoryCategorySerializer(serializers.ModelSerializer):
    memory_count = serializers.IntegerField(source='memories.count', read_only=True)
    
    class Meta:
        model = MemoryCategory
        fields = ['id', 'name', 'icon', 'description', 'color', 'order', 'is_active', 'memory_count']


class MemoryBoardSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    department_name = serializers.CharField(
        source='department.name', 
        read_only=True,
        allow_null=True
    )
    category_name = serializers.CharField(
        source='category.name',
        read_only=True,
        allow_null=True
    )
    category_icon = serializers.CharField(
        source='category.icon',
        read_only=True,
        allow_null=True
    )
    category_color = serializers.CharField(
        source='category.color',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = MemoryBoard
        fields = ['id', 'title', 'photo_url', 'caption', 'department', 'department_name', 
                  'category', 'category_name', 'category_icon', 'category_color',
                  'memory_type', 'created_at', 'author_name', 'author_program', 'author_year']
        
    def get_photo_url(self, obj):
        if obj.photo:
            # Return full URL with domain for frontend to access
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

class TraineeSuccessStorySerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    department_name = serializers.CharField(source='department.name', read_only=True)
    profile_images = ProfileImageSerializer(many=True, read_only=True, source='profile_images')
    
    class Meta:
        model = TraineeSuccessStory
        fields = ['id', 'name', 'photo_url', 'bio', 'achievement', 'department', 'department_name', 'graduation_year', 'current_position', 'created_at', 'my_story', 'project_showcase', 'skills_acquired', 'profile_images']
        
    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None

class AboutINSASerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    campus_photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AboutINSA
        fields = '__all__'
        
    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None

    def get_campus_photo_url(self, obj):
        return obj.campus_photo.url if obj.campus_photo else None


class LeadershipSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Leadership
        fields = ['id', 'name', 'position', 'photo_url', 'message', 'leadership_type', 'order', 'is_active', 'created_at', 'updated_at']
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None
