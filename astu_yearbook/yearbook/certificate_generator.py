import os
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
import traceback

class CertificateGenerator:
    def __init__(self):
        # Use the certificate template from the media/certificates folder
        self.template_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'insa_summercamp_certeficate.png')
        self.output_dir = os.path.join(settings.MEDIA_ROOT, 'certificates', 'generated')
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate_certificate(self, student_id, student_name, department, graduation_year=2024):
        """
        Generate a certificate for a student using the exact logic from the working FastAPI app
        """
        try:
            # Check if template exists
            if not os.path.exists(self.template_path):
                print(f"Template image not found at: {self.template_path}")
                return None

            # Load the certificate template
            img = Image.open(self.template_path)
            draw = ImageDraw.Draw(img)
            
            # Fonts - Use the same logic as the working certificate verification app
            try:
                font_path = "arial.ttf"
                font_name = ImageFont.truetype(font_path, 150)  # bigger for name
                font_link = ImageFont.truetype(font_path, 50)    # smaller for link
            except OSError:
                # Fallback to default font if arial.ttf is not found
                font_name = ImageFont.load_default()
                font_link = ImageFont.load_default()
            
            # Add student name (centered horizontally, fixed vertical position)
            name_text = student_name
            name_bbox = draw.textbbox((0, 0), name_text, font=font_name)
            name_width = name_bbox[2] - name_bbox[0]
            name_x = (img.width - name_width) // 2
            name_y = 1070  # Fixed position for name
            draw.text((name_x, name_y), name_text, fill="black", font=font_name)
            
            # Add verification link (centered horizontally, fixed vertical position)
            # Use local verification URL that actually works
            verification_link = f"http://localhost:8085/yearbook/verify/{student_id}/"
            link_bbox = draw.textbbox((0, 0), verification_link, font=font_link)
            link_width = link_bbox[2] - link_bbox[0]
            link_x = (img.width - link_width) // 2
            link_y = 2100  # Fixed position for verification link
            draw.text((link_x, link_y), verification_link, fill="blue", font=font_link)
            
            # Save certificate
            filename = f"{student_id}_{student_name.replace(' ', '_')}_certificate.png"
            output_path = os.path.join(self.output_dir, filename)
            img.save(output_path)
            
            # Return relative path for URL generation
            relative_path = f"certificates/generated/{filename}"
            return relative_path
            
        except Exception as e:
            print(f"Error generating certificate: {e}")
            traceback.print_exc()
            return None
    
    def get_certificate_url(self, student_id, student_name, department, graduation_year=2024):
        """
        Get or generate certificate URL for a student
        """
        filename = f"{student_id}_{student_name.replace(' ', '_')}_certificate.png"
        file_path = os.path.join(self.output_dir, filename)
        
        # Check if certificate already exists
        if os.path.exists(file_path):
            return f"certificates/generated/{filename}"
        
        # Generate new certificate
        return self.generate_certificate(student_id, student_name, department, graduation_year)