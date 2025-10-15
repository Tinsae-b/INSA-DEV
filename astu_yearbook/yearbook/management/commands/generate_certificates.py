from django.core.management.base import BaseCommand
from yearbook.certificate_generator import CertificateGenerator

class Command(BaseCommand):
    help = 'Generate certificates for all students'

    def handle(self, *args, **options):
        generator = CertificateGenerator()
        
        # Student data from mock data
        students_data = [
            {
                "student_id": "INSA001",
                "name": "Alemayehu Kebede",
                "department": "Cyber Security"
            },
            {
                "student_id": "INSA002", 
                "name": "Sara Teshome",
                "department": "Development"
            },
            {
                "student_id": "INSA003",
                "name": "Michael Abebe", 
                "department": "Embedded Systems"
            },
            {
                "student_id": "INSA004",
                "name": "Hanan Mohammed",
                "department": "Artificial Intelligence"
            },
            {
                "student_id": "INSA005",
                "name": "Dawit Assefa",
                "department": "Aerospace"
            },
            {
                "student_id": "INSA006",
                "name": "Rahel Belete",
                "department": "Cyber Security"
            },
            {
                "student_id": "INSA007",
                "name": "Samuel Teshome",
                "department": "Development"
            },
            {
                "student_id": "INSA008",
                "name": "Meron Zeleke",
                "department": "Embedded Systems"
            }
        ]
        
        generated_count = 0
        failed_count = 0
        
        for student in students_data:
            try:
                certificate_path = generator.generate_certificate(
                    student["student_id"],
                    student["name"],
                    student["department"],
                    2024
                )
                
                if certificate_path:
                    self.stdout.write(
                        self.style.SUCCESS(f'✓ Generated certificate for {student["name"]} ({student["student_id"]})')
                    )
                    generated_count += 1
                else:
                    self.stdout.write(
                        self.style.ERROR(f'✗ Failed to generate certificate for {student["name"]} ({student["student_id"]})')
                    )
                    failed_count += 1
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'✗ Error generating certificate for {student["name"]}: {str(e)}')
                )
                failed_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'\nCertificate generation complete!')
        )
        self.stdout.write(f'Generated: {generated_count}')
        self.stdout.write(f'Failed: {failed_count}')











