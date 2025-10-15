# yearbook/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib.admin import AdminSite
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib import messages
from django.db import transaction
from django.core.files.base import ContentFile
import os
from .models import *
from .certificate_generator import CertificateGenerator

# Custom Admin Site Configuration
admin.site.site_header = "INSA Cyber Talent Yearbook Administration"
admin.site.site_title = "INSA Yearbook Admin"
admin.site.index_title = "Welcome to INSA Cyber Talent Yearbook Administration"

# Department Admin
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'theme_color_preview', 'student_count', 'intro_message_preview')
    list_filter = ('theme_color',)
    search_fields = ('name', 'intro_message')
    ordering = ('name',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'intro_message', 'theme_color')
        }),
        ('Visual Assets', {
            'fields': ('cover_image', 'group_photo'),
            'classes': ('collapse',)
        }),
    )
    
    def theme_color_preview(self, obj):
        if obj.theme_color:
            return format_html(
                '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px; display: inline-block; margin-right: 5px;"></div>{}',
                obj.theme_color, obj.theme_color
            )
        return "No color set"
    theme_color_preview.short_description = "Theme Color"
    
    def intro_message_preview(self, obj):
        return obj.intro_message[:50] + "..." if len(obj.intro_message) > 50 else obj.intro_message
    intro_message_preview.short_description = "Intro Message"
    
    def student_count(self, obj):
        return obj.students.count()
    student_count.short_description = "Students"

# Student Admin with comprehensive controls
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name', 'department', 'is_featured', 'photo_preview', 'quote_preview', 'has_certificate')
    list_filter = ('department', 'is_featured', 'created_at')
    search_fields = ('student_id', 'name', 'quote', 'last_words', 'highlight_tagline')
    list_editable = ('is_featured',)
    autocomplete_fields = ('department',)
    ordering = ('student_id',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('student_id', 'name', 'department', 'photo')
        }),
        ('Content', {
            'fields': ('quote', 'last_words', 'highlight_tagline', 'description', 'my_story')
        }),
        ('Status & Settings', {
            'fields': ('is_featured',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'has_certificate')
    
    actions = ['generate_certificates', 'mark_as_featured', 'mark_as_not_featured']
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"
    
    def quote_preview(self, obj):
        return obj.quote[:50] + "..." if len(obj.quote) > 50 else obj.quote
    quote_preview.short_description = "Quote"
    
    def has_certificate(self, obj):
        try:
            generator = CertificateGenerator()
            certificate_path = generator.get_certificate_url(obj.student_id, obj.name, obj.department.name, 2024)
            if certificate_path:
                return format_html('<span style="color: green;">✓ Generated</span>')
            else:
                return format_html('<span style="color: red;">✗ Not Generated</span>')
        except:
            return format_html('<span style="color: red;">✗ Error</span>')
    has_certificate.short_description = "Certificate"
    
    def generate_certificates(self, request, queryset):
        generator = CertificateGenerator()
        generated = 0
        failed = 0
        
        for student in queryset:
            try:
                certificate_path = generator.generate_certificate(
                    student.student_id, 
                    student.name, 
                    student.department.name, 
                    2024
                )
                if certificate_path:
                    generated += 1
                else:
                    failed += 1
            except Exception as e:
                failed += 1
        
        if generated > 0:
            messages.success(request, f'Successfully generated {generated} certificates.')
        if failed > 0:
            messages.error(request, f'Failed to generate {failed} certificates.')
    generate_certificates.short_description = "Generate certificates for selected students"
    
    def mark_as_featured(self, request, queryset):
        queryset.update(is_featured=True)
        messages.success(request, f'Marked {queryset.count()} students as featured.')
    mark_as_featured.short_description = "Mark as featured"
    
    def mark_as_not_featured(self, request, queryset):
        queryset.update(is_featured=False)
        messages.success(request, f'Marked {queryset.count()} students as not featured.')
    mark_as_not_featured.short_description = "Mark as not featured"

# Faculty Tribute Admin - HIDDEN FROM ADMIN
# @admin.register(FacultyTribute)
class FacultyTributeAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'order', 'photo_preview', 'tribute_preview')
    list_editable = ('order',)
    ordering = ('order',)
    search_fields = ('name', 'position', 'tribute_message')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'position', 'photo', 'order')
        }),
        ('Tribute Content', {
            'fields': ('tribute_message',)
        }),
    )
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"
    
    def tribute_preview(self, obj):
        return obj.tribute_message[:50] + "..." if len(obj.tribute_message) > 50 else obj.tribute_message
    tribute_preview.short_description = "Tribute Message"

# Leadership Messages Admin
@admin.register(DirectorGeneralMessage)
class DirectorGeneralMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'photo_preview', 'created_at')
    readonly_fields = ('created_at', 'name', 'position', 'photo', 'photo_preview')
    
    fieldsets = (
        ('Leadership Information (Read-Only)', {
            'fields': ('photo_preview', 'name', 'position'),
            'description': 'Name, position, and photo cannot be changed. Only the message below can be edited.'
        }),
        ('Message Content (Editable)', {
            'fields': ('speech',),
            'description': 'Edit the Director General\'s message to graduates here.'
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"
    
    def has_add_permission(self, request):
        # Only allow one Director General message
        return not DirectorGeneralMessage.objects.exists()

@admin.register(CyberTalentDirectorMessage)
class CyberTalentDirectorMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'photo_preview', 'created_at')
    readonly_fields = ('created_at', 'name', 'position', 'photo', 'photo_preview')
    
    fieldsets = (
        ('Leadership Information (Read-Only)', {
            'fields': ('photo_preview', 'name', 'position'),
            'description': 'Name, position, and photo cannot be changed. Only the message below can be edited.'
        }),
        ('Message Content (Editable)', {
            'fields': ('speech',),
            'description': 'Edit the Cyber Talent Director\'s message to graduates here.'
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"
    
    def has_add_permission(self, request):
        # Only allow one Cyber Talent Director message
        return not CyberTalentDirectorMessage.objects.exists()

# Memory Category Admin
@admin.register(MemoryCategory)
class MemoryCategoryAdmin(admin.ModelAdmin):
    list_display = ('icon_name', 'name', 'memory_count', 'color_preview', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('order', 'name')
    search_fields = ['name']  # Enable autocomplete in other admin forms
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'icon', 'description')
        }),
        ('Display Settings', {
            'fields': ('color', 'order', 'is_active')
        }),
    )
    
    def icon_name(self, obj):
        return format_html('<span style="font-size: 24px;">{}</span>', obj.icon)
    icon_name.short_description = "Icon"
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 30px; height: 30px; background-color: {}; border-radius: 5px; border: 1px solid #ccc;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"
    
    def memory_count(self, obj):
        count = obj.memories.count()
        return format_html('<strong>{}</strong> memories', count)
    memory_count.short_description = "Memories"


# Memory Board Admin
@admin.register(MemoryBoard)
class MemoryBoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'category_display', 'memory_type', 'department', 'photo_preview', 'author_name', 'created_at')
    list_filter = ('category', 'memory_type', 'department', 'created_at')
    search_fields = ('title', 'caption', 'author_name', 'author_program')
    autocomplete_fields = ('department', 'category')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'category', 'memory_type', 'department')
        }),
        ('Content', {
            'fields': ('photo', 'caption')
        }),
        ('Author Information', {
            'fields': ('author_name', 'author_program', 'author_year'),
            'classes': ('collapse',)
        }),
    )
    
    def category_display(self, obj):
        if obj.category:
            return format_html(
                '<span style="font-size: 16px;">{}</span> {}',
                obj.category.icon,
                obj.category.name
            )
        return "No category"
    category_display.short_description = "Category"
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"

# Trainee Success Story Admin
@admin.register(TraineeSuccessStory)
class TraineeSuccessStoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'graduation_year', 'photo_preview', 'bio_preview')
    list_filter = ('department', 'graduation_year')
    search_fields = ('name', 'bio', 'achievement')
    autocomplete_fields = ('department',)
    ordering = ('-graduation_year', 'name')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'department', 'graduation_year', 'photo')
        }),
        ('Success Story', {
            'fields': ('bio', 'achievement')
        }),
    )
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"
    
    def bio_preview(self, obj):
        return obj.bio[:50] + "..." if len(obj.bio) > 50 else obj.bio
    bio_preview.short_description = "Bio"

# Profile Image Admin - HIDDEN FROM ADMIN
# @admin.register(ProfileImage)
class ProfileImageAdmin(admin.ModelAdmin):
    list_display = ('trainee', 'image_preview', 'caption')
    search_fields = ('caption', 'trainee__name')
    autocomplete_fields = ('trainee',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Image"

# About INSA Admin - HIDDEN FROM ADMIN
# @admin.register(AboutINSA)
class AboutINSAAdmin(admin.ModelAdmin):
    list_display = ('established_year', 'trainee_count')
    readonly_fields = ('updated_at',)
    
    fieldsets = (
        ('Organization Information', {
            'fields': ('established_year', 'vision_statement', 'history_summary')
        }),
        ('Statistics', {
            'fields': ('trainee_count',)
        }),
        ('Visual Assets', {
            'fields': ('logo', 'campus_photo'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )


# Leadership Admin
@admin.register(Leadership)
class LeadershipAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'leadership_type', 'photo_preview', 'order', 'is_active', 'updated_at')
    list_editable = ('order', 'is_active')
    list_filter = ('leadership_type', 'is_active', 'created_at')
    search_fields = ('name', 'position', 'message')
    ordering = ('order', 'name')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'position', 'leadership_type', 'photo')
        }),
        ('Message', {
            'fields': ('message',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 50%;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"
    
    def has_add_permission(self, request):
        # Only allow one About INSA instance
        return not AboutINSA.objects.exists()

# Custom Admin Actions
class CertificateManagementAdmin(admin.ModelAdmin):
    actions = ['generate_all_certificates', 'regenerate_certificates']
    
    def generate_all_certificates(self, request, queryset):
        generator = CertificateGenerator()
        generated = 0
        failed = 0
        
        students = Student.objects.all()
        for student in students:
            try:
                certificate_path = generator.generate_certificate(
                    student.student_id, 
                    student.name, 
                    student.department.name, 
                    2024
                )
                if certificate_path:
                    generated += 1
                else:
                    failed += 1
            except Exception as e:
                failed += 1
        
        if generated > 0:
            messages.success(request, f'Successfully generated {generated} certificates.')
        if failed > 0:
            messages.error(request, f'Failed to generate {failed} certificates.')
    generate_all_certificates.short_description = "Generate certificates for ALL students"
    
    def regenerate_certificates(self, request, queryset):
        generator = CertificateGenerator()
        regenerated = 0
        failed = 0
        
        for student in queryset:
            try:
                # Force regeneration by deleting existing certificate first
                import os
                from django.conf import settings
                certificate_filename = f"{student.student_id}_{student.name.replace(' ', '_')}_certificate.png"
                certificate_path = os.path.join(settings.MEDIA_ROOT, "certificates", "generated", certificate_filename)
                
                if os.path.exists(certificate_path):
                    os.remove(certificate_path)
                
                certificate_path = generator.generate_certificate(
                    student.student_id, 
                    student.name, 
                    student.department.name, 
                    2024
                )
                if certificate_path:
                    regenerated += 1
                else:
                    failed += 1
            except Exception as e:
                failed += 1
        
        if regenerated > 0:
            messages.success(request, f'Successfully regenerated {regenerated} certificates.')
        if failed > 0:
            messages.error(request, f'Failed to regenerate {failed} certificates.')
    regenerate_certificates.short_description = "Regenerate certificates for selected students"

# Apply the certificate management to Student admin
StudentAdmin.actions.extend(['generate_all_certificates', 'regenerate_certificates'])