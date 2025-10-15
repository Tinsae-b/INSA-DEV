from django.core.management.base import BaseCommand
from yearbook.models import Student, Department

class Command(BaseCommand):
    help = 'Populate the database with sample students for INSA Cyber Talent'

    def handle(self, *args, **options):
        # Create departments if they don't exist
        departments_data = [
            {"name": "Cyber Security"},
            {"name": "Development"},
            {"name": "Embedded Systems"},
            {"name": "Emerging Technologies"},
            {"name": "Aerospace"},
        ]
        
        for dept_data in departments_data:
            dept, created = Department.objects.get_or_create(
                name=dept_data["name"],
                defaults={
                    "cover_image": "departments/default.jpg",
                    "intro_message": f"Welcome to {dept_data['name']} specialization",
                    "theme_color": "#3498db"
                }
            )
            if created:
                self.stdout.write(f"Created department: {dept.name}")
        
        # Sample students data
        students_data = [
            {
                "student_id": "INSA001",
                "name": "Alemayehu Kebede",
                "department_name": "Cyber Security",
                "quote": "Cybersecurity is not just a job, it's a mission to protect our nation's digital future.",
                "last_words": "The INSA Cyber Talent program has transformed me into a cybersecurity professional. I'm proud to be part of Ethiopia's digital defense team. Thank you for this incredible journey!",
                "highlight_tagline": "Advanced Threat Detection Specialist",
                "description": "Led the implementation of a comprehensive security monitoring system that reduced incident response time by 60%. Specialized in penetration testing and digital forensics.",
                "is_featured": True
            },
            {
                "student_id": "INSA002",
                "name": "Sara Teshome",
                "department_name": "Development",
                "quote": "Building secure applications that protect millions of users has been my dream.",
                "last_words": "Building secure applications that protect millions of users has been my dream. INSA Cyber Talent made it possible. Ready to secure Ethiopia's digital future!",
                "highlight_tagline": "Secure Software Developer",
                "description": "Built secure mobile banking applications serving over 2 million users with zero security incidents. Expert in secure coding and API security.",
                "is_featured": True
            },
            {
                "student_id": "INSA003",
                "name": "Michael Abebe",
                "department_name": "Embedded Systems",
                "quote": "Securing critical infrastructure is a huge responsibility and privilege.",
                "last_words": "Securing critical infrastructure like aviation systems is a huge responsibility. I'm grateful to INSA for preparing me to protect our nation's most important systems.",
                "highlight_tagline": "IoT Security Engineer",
                "description": "Secured critical aviation systems and implemented IoT security protocols for fleet management at Ethiopian Airlines.",
                "is_featured": True
            },
            {
                "student_id": "INSA004",
                "name": "Hanan Mohammed",
                "department_name": "Emerging Technologies",
                "quote": "Using emerging technologies to defend against cyber threats is the future of cybersecurity.",
                "last_words": "Using emerging technologies to defend against cyber threats is the future. INSA gave me the tools to be at the forefront of this revolution. Proud to be an emerging tech security specialist!",
                "highlight_tagline": "Emerging Tech Security Specialist",
                "description": "Developed AI-powered threat detection system with 99.2% accuracy. Expert in machine learning security, adversarial AI, and emerging cybersecurity technologies.",
                "is_featured": True
            },
            {
                "student_id": "INSA005",
                "name": "Dawit Assefa",
                "department_name": "Aerospace",
                "quote": "Securing Ethiopia's space communications is a privilege and honor.",
                "last_words": "Securing Ethiopia's space communications is a privilege. INSA Cyber Talent prepared me for this frontier of cybersecurity. Ready to protect our nation's space assets!",
                "highlight_tagline": "Space Systems Security Expert",
                "description": "Developed satellite communication security protocols for Ethiopia's space infrastructure.",
                "is_featured": True
            },
            {
                "student_id": "INSA006",
                "name": "Rahel Belete",
                "department_name": "Cyber Security",
                "quote": "Every day is a new challenge in cybersecurity, and I'm ready for it.",
                "last_words": "Every day is a new challenge in cybersecurity. INSA taught me to be resilient and always stay ahead of threats. Grateful for this life-changing opportunity!",
                "highlight_tagline": "Network Security Analyst",
                "description": "Expert in network intrusion detection and prevention systems. Specialized in incident response and vulnerability assessment.",
                "is_featured": False
            },
            {
                "student_id": "INSA007",
                "name": "Samuel Teshome",
                "department_name": "Development",
                "quote": "Blockchain technology is revolutionizing security and I'm part of it.",
                "last_words": "Blockchain technology is revolutionizing security. INSA gave me the expertise to build secure, decentralized systems. Excited to contribute to Ethiopia's digital transformation!",
                "highlight_tagline": "Blockchain Security Developer",
                "description": "Designed and implemented blockchain-based identity management system for secure digital transactions.",
                "is_featured": False
            },
            {
                "student_id": "INSA008",
                "name": "Meron Zeleke",
                "department_name": "Embedded Systems",
                "quote": "Smart cities need smart security, and I'm here to provide it.",
                "last_words": "Smart cities need smart security. INSA prepared me to secure the connected future. Proud to be part of Ethiopia's smart city security initiatives!",
                "highlight_tagline": "Smart City Security Engineer",
                "description": "Developed IoT security infrastructure for smart city implementations across Ethiopia.",
                "is_featured": False
            }
        ]
        
        # Create students
        for student_data in students_data:
            try:
                department = Department.objects.get(name=student_data["department_name"])
                
                student, created = Student.objects.get_or_create(
                    student_id=student_data["student_id"],
                    defaults={
                        "name": student_data["name"],
                        "department": department,
                        "photo": "students/default.jpg",
                        "quote": student_data["quote"],
                        "last_words": student_data["last_words"],
                        "highlight_tagline": student_data["highlight_tagline"],
                        "description": student_data["description"],
                        "is_featured": student_data["is_featured"]
                    }
                )
                
                if created:
                    self.stdout.write(f"Created student: {student.name} ({student.student_id})")
                else:
                    self.stdout.write(f"Student already exists: {student.name} ({student.student_id})")
                    
            except Department.DoesNotExist:
                self.stdout.write(f"Department not found: {student_data['department_name']}")
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated students database!')
        )







