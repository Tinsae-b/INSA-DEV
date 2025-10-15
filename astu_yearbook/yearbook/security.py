"""
Security utilities and middleware for the yearbook application.

This module provides additional security measures beyond Django's built-in protections:
- Input sanitization
- File upload validation
- Rate limiting decorators
- Security event logging
"""

import os
import bleach
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from functools import wraps
import logging

logger = logging.getLogger('django.security')


class SecurityMiddleware:
    """
    Custom security middleware for additional protections
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log suspicious requests
        self.check_suspicious_patterns(request)
        
        response = self.get_response(request)
        
        # Add additional security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response

    def check_suspicious_patterns(self, request):
        """Log suspicious request patterns"""
        suspicious_patterns = [
            '../', '..\\',  # Path traversal
            '<script', 'javascript:',  # XSS attempts
            'union select', 'drop table',  # SQL injection
            'exec(', 'eval(',  # Code injection
        ]
        
        request_data = str(request.GET) + str(request.POST) + request.path
        request_data_lower = request_data.lower()
        
        for pattern in suspicious_patterns:
            if pattern in request_data_lower:
                logger.warning(
                    f'Suspicious pattern detected: {pattern} from IP: {self.get_client_ip(request)}'
                )
                break

    @staticmethod
    def get_client_ip(request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


def sanitize_html_input(text, allowed_tags=None, allowed_attributes=None):
    """
    Sanitize HTML input to prevent XSS attacks.
    
    Args:
        text: The text to sanitize
        allowed_tags: List of allowed HTML tags (default: basic formatting)
        allowed_attributes: Dict of allowed attributes per tag
    
    Returns:
        Sanitized text safe for display
    """
    if not text:
        return text
    
    if allowed_tags is None:
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li']
    
    if allowed_attributes is None:
        allowed_attributes = {'a': ['href', 'title']}
    
    return bleach.clean(
        text,
        tags=allowed_tags,
        attributes=allowed_attributes,
        strip=True
    )


def sanitize_filename(filename):
    """
    Sanitize filename to prevent path traversal and other attacks.
    
    Args:
        filename: Original filename
    
    Returns:
        Sanitized filename
    """
    # Remove path components
    filename = os.path.basename(filename)
    
    # Remove or replace dangerous characters
    dangerous_chars = ['..', '/', '\\', '\x00', ':', '*', '?', '"', '<', '>', '|']
    for char in dangerous_chars:
        filename = filename.replace(char, '_')
    
    # Limit filename length
    max_length = 255
    if len(filename) > max_length:
        name, ext = os.path.splitext(filename)
        filename = name[:max_length-len(ext)] + ext
    
    return filename


def validate_file_extension(filename, allowed_extensions=None):
    """
    Validate file extension against allowed list.
    
    Args:
        filename: The filename to validate
        allowed_extensions: List of allowed extensions (e.g., ['.jpg', '.png'])
    
    Raises:
        ValidationError: If file extension is not allowed
    """
    if allowed_extensions is None:
        allowed_extensions = settings.ALLOWED_IMAGE_EXTENSIONS
    
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in allowed_extensions:
        raise ValidationError(
            _(f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}')
        )


def validate_file_size(file, max_size=None):
    """
    Validate file size.
    
    Args:
        file: The uploaded file object
        max_size: Maximum size in bytes (default from settings)
    
    Raises:
        ValidationError: If file is too large
    """
    if max_size is None:
        max_size = settings.MAX_UPLOAD_SIZE
    
    if file.size > max_size:
        max_size_mb = max_size / (1024 * 1024)
        raise ValidationError(
            _(f'File too large. Maximum size allowed: {max_size_mb}MB')
        )


def validate_image_file(file):
    """
    Comprehensive validation for image uploads.
    
    Args:
        file: The uploaded file object
    
    Raises:
        ValidationError: If file is not a valid image
    """
    # Validate size
    validate_file_size(file)
    
    # Validate extension
    validate_file_extension(file.name, settings.ALLOWED_IMAGE_EXTENSIONS)
    
    # Validate actual file content (not just extension)
    try:
        from PIL import Image
        img = Image.open(file)
        img.verify()
        
        # Reset file pointer after verification
        file.seek(0)
        
        # Check for suspicious dimensions
        if img.size[0] > 10000 or img.size[1] > 10000:
            raise ValidationError(_('Image dimensions too large'))
            
    except Exception as e:
        raise ValidationError(_(f'Invalid image file: {str(e)}'))


def require_staff(view_func):
    """
    Decorator to require staff status for a view.
    Provides better security than just @staff_required.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            logger.warning(f'Unauthenticated access attempt to staff view from IP: {SecurityMiddleware.get_client_ip(request)}')
            from django.contrib.auth.views import redirect_to_login
            return redirect_to_login(request.get_full_path())
        
        if not request.user.is_staff:
            logger.warning(f'Non-staff access attempt by user: {request.user.username} from IP: {SecurityMiddleware.get_client_ip(request)}')
            from django.http import HttpResponseForbidden
            return HttpResponseForbidden('Staff access required')
        
        return view_func(request, *args, **kwargs)
    
    return wrapper


def log_security_event(event_type, description, request=None, severity='WARNING'):
    """
    Log security-related events.
    
    Args:
        event_type: Type of security event (e.g., 'failed_login', 'suspicious_request')
        description: Detailed description of the event
        request: Django request object (optional)
        severity: Log severity level
    """
    ip_address = 'unknown'
    user = 'anonymous'
    
    if request:
        ip_address = SecurityMiddleware.get_client_ip(request)
        if request.user.is_authenticated:
            user = request.user.username
    
    log_message = f'[{event_type}] User: {user}, IP: {ip_address}, Description: {description}'
    
    if severity == 'ERROR':
        logger.error(log_message)
    elif severity == 'CRITICAL':
        logger.critical(log_message)
    elif severity == 'INFO':
        logger.info(log_message)
    else:
        logger.warning(log_message)


# Rate limiting decorator (requires django-ratelimit)
from django_ratelimit.decorators import ratelimit

def rate_limit_api(key='ip', rate='100/h', method='ALL'):
    """
    Decorator for rate limiting API endpoints.
    
    Args:
        key: What to rate limit on ('ip', 'user', etc.)
        rate: Rate limit string (e.g., '100/h' for 100 requests per hour)
        method: HTTP methods to apply rate limiting to
    """
    return ratelimit(key=key, rate=rate, method=method)


# CSRF exemption wrapper with logging
def csrf_exempt_with_log(view_func):
    """
    CSRF exempt wrapper that logs the exemption.
    Use sparingly and only when absolutely necessary.
    """
    from django.views.decorators.csrf import csrf_exempt
    
    @csrf_exempt
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        logger.info(f'CSRF exempt view accessed: {view_func.__name__} from IP: {SecurityMiddleware.get_client_ip(request)}')
        return view_func(request, *args, **kwargs)
    
    return wrapper

