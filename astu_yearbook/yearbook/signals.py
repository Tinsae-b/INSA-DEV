# yearbook/signals.py
from django.db.models.signals import post_save, post_init
from django.dispatch import receiver
from django.conf import settings
import os
from .models import Student
from .certificate_generator import CertificateGenerator


@receiver(post_save, sender=Student)
def generate_student_certificate(sender, instance, created, **kwargs):
    """
    Automatically generate certificate when a student is created or updated
    """
    try:
        generator = CertificateGenerator()
        
        # Generate certificate for the student
        certificate_path = generator.generate_certificate(
            student_id=instance.student_id,
            student_name=instance.name,
            department=instance.department.name if instance.department else "General",
            graduation_year=2024
        )
        
        if certificate_path:
            print(f"✅ Certificate generated for {instance.name} (ID: {instance.student_id})")
            print(f"📄 Certificate saved at: {certificate_path}")
        else:
            print(f"❌ Failed to generate certificate for {instance.name} (ID: {instance.student_id})")
            
    except Exception as e:
        print(f"❌ Error generating certificate for {instance.name}: {str(e)}")
        import traceback
        traceback.print_exc()


@receiver(post_init, sender=Student)
def check_existing_certificate(sender, instance, **kwargs):
    """
    Check if certificate exists when student is loaded
    """
    try:
        if instance.student_id:  # Only check if student_id exists
            generator = CertificateGenerator()
            filename = f"{instance.student_id}_{instance.name.replace(' ', '_')}_certificate.png"
            file_path = os.path.join(generator.output_dir, filename)
            
            # Store certificate status as instance attribute
            instance._certificate_exists = os.path.exists(file_path)
            instance._certificate_path = f"certificates/generated/{filename}" if instance._certificate_exists else None
            
    except Exception as e:
        # If there's an error, assume certificate doesn't exist
        instance._certificate_exists = False
        instance._certificate_path = None



