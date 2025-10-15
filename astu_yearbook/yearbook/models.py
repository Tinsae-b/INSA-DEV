# yearbook/models.py
from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    cover_image = models.ImageField(upload_to='departments/')
    group_photo = models.ImageField(upload_to='departments/', blank=True, null=True)
    intro_message = models.TextField()
    theme_color = models.CharField(max_length=7, default='#3498db')  

    class Meta:
        ordering = ['name']
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        
    def __str__(self):
        return self.name

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True, blank=True, default="", help_text="Auto-generated ID (e.g., INSA009) - Leave blank for automatic generation")
    name = models.CharField(max_length=100)
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE,
        related_name='students'
    )
    photo = models.ImageField(upload_to='students/')
    quote = models.CharField(max_length=200)
    last_words = models.TextField()
    highlight_tagline = models.CharField(max_length=100)
    description = models.TextField(help_text="What I'll miss most, proudest moments, etc.")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    my_story = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Student"
        verbose_name_plural = "Students"
        
    def __str__(self):
        return f"{self.name} ({self.department.name})"
    
    def save(self, *args, **kwargs):
        """
        Override save to auto-generate student_id if not provided
        """
        if not self.student_id or self.student_id == "STU001" or self.student_id == "":
            # Find the highest INSA number by looking at all existing IDs
            existing_students = Student.objects.filter(student_id__startswith='INSA').exclude(pk=self.pk)
            
            max_number = 0
            for student in existing_students:
                try:
                    # Extract the number from student ID (e.g., INSA008 -> 8)
                    number = int(student.student_id.replace('INSA', ''))
                    if number > max_number:
                        max_number = number
                except (ValueError, AttributeError):
                    continue
            
            # Generate new student_id by incrementing the highest number found
            new_number = max_number + 1
            self.student_id = f"INSA{new_number:03d}"
        
        super().save(*args, **kwargs)
    
    def get_certificate_url(self):
        """
        Generate and return certificate URL for this student using the exact logic from the working FastAPI app
        """
        from PIL import Image, ImageDraw, ImageFont
        from django.conf import settings
        import os
        import traceback
        
        try:
            # Use the certificate template from the media/certificates folder
            template_path = os.path.join(settings.MEDIA_ROOT, 'certificates', 'insa_summercamp_certeficate.png')
            output_dir = os.path.join(settings.MEDIA_ROOT, 'certificates', 'generated')
            os.makedirs(output_dir, exist_ok=True)
            
            # Check if template exists
            if not os.path.exists(template_path):
                print(f"Template image not found at: {template_path}")
                return None

            # Prefer using the explicit student_id field for filenames; fall back to numeric id
            sid = self.student_id if self.student_id else f"STU{self.id:03d}"
            filename = f"{sid}_{self.name.replace(' ', '_')}_certificate.png"
            file_path = os.path.join(output_dir, filename)
            
            # Check if certificate already exists
            if os.path.exists(file_path):
                return f"certificates/generated/{filename}"
            
            # Load the certificate template
            img = Image.open(template_path)
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
            name_text = self.name
            name_bbox = draw.textbbox((0, 0), name_text, font=font_name)
            name_width = name_bbox[2] - name_bbox[0]
            name_x = (img.width - name_width) // 2
            name_y = 1070  # Fixed position for name
            draw.text((name_x, name_y), name_text, fill="black", font=font_name)
            
            # Add verification link (centered horizontally, fixed vertical position)
            # Use the actual server URL for verification
            verification_link = f"http://172.27.12.216:8000/yearbook/verify/{sid}/"
            link_bbox = draw.textbbox((0, 0), verification_link, font=font_link)
            link_width = link_bbox[2] - link_bbox[0]
            link_x = (img.width - link_width) // 2
            link_y = 2100  # Fixed position for verification link
            draw.text((link_x, link_y), verification_link, fill="blue", font=font_link)
            
            # Save certificate
            img.save(file_path)
            
            # Return relative path for URL generation
            return f"certificates/generated/{filename}"
            
        except Exception as e:
            print(f"Error generating certificate: {e}")
            traceback.print_exc()
            return None

class FacultyTribute(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='faculty/')
    message = models.TextField()
    position = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0, help_text="Display order (lowest first)")
    department_name = models.CharField(max_length=100, blank=True, null=True)
    years_of_service = models.PositiveIntegerField(blank=True, null=True)
    specialization = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Faculty Tribute"
        verbose_name_plural = "Faculty Tributes"
        
    def __str__(self):
        return f"{self.name} - {self.position}"

class DirectorGeneralMessage(models.Model):
    name = models.CharField(max_length=100, default="H.E. Tigist Hamid")
    photo = models.ImageField(upload_to='leadership/')
    speech = models.TextField()
    position = models.CharField(max_length=200, default="Director General of Information Network Security Administration (INSA), Ethiopia")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Director General Message"
        verbose_name_plural = "Director General Messages"
        
    def __str__(self):
        return f"{self.name} - {self.position}"

class CyberTalentDirectorMessage(models.Model):
    name = models.CharField(max_length=100, default="Bishaw Beyene")
    photo = models.ImageField(upload_to='leadership/')
    speech = models.TextField()
    position = models.CharField(max_length=100, default="INSA Cyber Talent Director")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Cyber Talent Director Message"
        verbose_name_plural = "Cyber Talent Director Messages"
        
    def __str__(self):
        return f"{self.name} - {self.position}"

class MemoryCategory(models.Model):
    """
    Category for organizing memories (Gaming, CTF, Coding Nights, Sports, etc.)
    """
    name = models.CharField(max_length=100, unique=True, help_text="Category name (e.g., Gaming & Entertainment)")
    icon = models.CharField(max_length=50, default="📷", help_text="Emoji or icon for the category (e.g., 🎮)")
    description = models.TextField(blank=True, help_text="Brief description of this memory category")
    color = models.CharField(max_length=7, default="#3B82F6", help_text="Hex color code for category (e.g., #3B82F6)")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers appear first)")
    is_active = models.BooleanField(default=True, help_text="Show this category on the frontend")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Memory Category"
        verbose_name_plural = "Memory Categories"
        ordering = ['order', 'name']
    
    def __str__(self):
        return f"{self.icon} {self.name}"
    
    def memory_count(self):
        """Return the number of memories in this category"""
        return self.memories.count()
    memory_count.short_description = "Memories"


class MemoryBoard(models.Model):
    MEMORY_TYPES = [
        ('GRAD', 'Graduation'),
        ('PARTY', 'Party'),
        ('STUDY', 'Study Session'),
        ('SPORT', 'Sports Event'),
        ('OTHER', 'Other'),
    ]
    
    title = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='memories/')
    caption = models.TextField()
    department = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='memories'
    )
    category = models.ForeignKey(
        MemoryCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='memories',
        help_text="Select the category for this memory"
    )
    memory_type = models.CharField(
        max_length=10, 
        choices=MEMORY_TYPES, 
        default='OTHER',
        help_text="Legacy category field (deprecated, use 'category' instead)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    author_name = models.CharField(max_length=100, blank=True, null=True)
    author_program = models.CharField(max_length=100, blank=True, null=True)
    author_year = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Memory Board Entry"
        verbose_name_plural = "Memory Board Entries"
        
    def __str__(self):
        return f"{self.title} ({self.get_memory_type_display()})"

class TraineeSuccessStory(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='trainees/')
    bio = models.TextField()
    achievement = models.TextField()
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE,
        related_name='trainees'
    )
    graduation_year = models.PositiveIntegerField(default=2024)
    current_position = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    my_story = models.TextField(blank=True, null=True)
    project_showcase = models.TextField(blank=True, null=True, help_text="Key projects completed during training")
    skills_acquired = models.TextField(blank=True, null=True, help_text="Technical skills gained")

    class Meta:
        ordering = ['-graduation_year']
        verbose_name = "Trainee Success Story"
        verbose_name_plural = "Trainee Success Stories"
        
    def __str__(self):
        return f"{self.name} ({self.department.name}, {self.graduation_year})"

class AboutINSA(models.Model):
    logo = models.ImageField(upload_to='about/')
    vision_statement = models.TextField()
    history_summary = models.TextField()
    campus_photo = models.ImageField(upload_to='about/')
    established_year = models.PositiveIntegerField(default=2024)
    trainee_count = models.PositiveIntegerField(default=500)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About INSA Cyber Talent"
        verbose_name_plural = "About INSA Cyber Talent"
        
    def __str__(self):
        return "About INSA Cyber Talent Information"


class Leadership(models.Model):
    """
    Leadership messages - Allows admins to add multiple leaders
    """
    LEADERSHIP_TYPES = [
        ('DIRECTOR', 'Director General'),
        ('CYBER_DIR', 'Cyber Talent Director'),
        ('DEP_DIR', 'Deputy Director'),
        ('ADVISOR', 'Senior Advisor'),
        ('OTHER', 'Other Leadership'),
    ]
    
    name = models.CharField(max_length=150, help_text="Leader's full name")
    position = models.CharField(max_length=200, help_text="Official title/position")
    photo = models.ImageField(upload_to='leadership/', help_text="Leader's professional photo")
    message = models.TextField(help_text="Leadership message to the graduates")
    leadership_type = models.CharField(
        max_length=15,
        choices=LEADERSHIP_TYPES,
        default='OTHER',
        help_text="Category of leadership position"
    )
    order = models.IntegerField(default=0, help_text="Display order (lower numbers appear first)")
    is_active = models.BooleanField(default=True, help_text="Show this leader on the frontend")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Leadership Message"
        verbose_name_plural = "Leadership Messages"
    
    def __str__(self):
        return f"{self.name} - {self.position}"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super().save(*args, **kwargs)

class ProfileImage(models.Model):
    image = models.ImageField(upload_to='profile_images/')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True, related_name='profile_images')
    trainee = models.ForeignKey(TraineeSuccessStory, on_delete=models.CASCADE, null=True, blank=True, related_name='profile_images')
    caption = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        if self.student:
            return f"Image for {self.student.name}"
        elif self.trainee:
            return f"Image for {self.trainee.name}"
        return "Profile Image"