from django.core.management.base import BaseCommand
from yearbook.models import MemoryCategory

class Command(BaseCommand):
    help = 'Populate the database with sample memory categories'

    def handle(self, *args, **options):
        # Sample memory categories data
        categories_data = [
            {
                "name": "Gaming & Entertainment",
                "icon": "🎮",
                "description": "Fun gaming sessions, tournaments, and entertainment activities",
                "color": "#FF6B6B",
                "order": 1,
                "is_active": True
            },
            {
                "name": "Study Sessions",
                "icon": "📚",
                "description": "Intensive study sessions, group projects, and academic activities",
                "color": "#4ECDC4",
                "order": 2,
                "is_active": True
            },
            {
                "name": "Sports & Activities",
                "icon": "⚽",
                "description": "Sports events, physical activities, and outdoor adventures",
                "color": "#45B7D1",
                "order": 3,
                "is_active": True
            },
            {
                "name": "CTF & Competitions",
                "icon": "🏆",
                "description": "Capture The Flag competitions, cybersecurity challenges, and tech contests",
                "color": "#96CEB4",
                "order": 4,
                "is_active": True
            },
            {
                "name": "Coding Nights",
                "icon": "💻",
                "description": "Late-night coding sessions, hackathons, and programming marathons",
                "color": "#FFEAA7",
                "order": 5,
                "is_active": True
            },
            {
                "name": "Social Events",
                "icon": "🎉",
                "description": "Parties, celebrations, and social gatherings with friends",
                "color": "#DDA0DD",
                "order": 6,
                "is_active": True
            },
            {
                "name": "Field Trips",
                "icon": "🚌",
                "description": "Educational field trips, industry visits, and external learning experiences",
                "color": "#98D8C8",
                "order": 7,
                "is_active": True
            },
            {
                "name": "Graduation",
                "icon": "🎓",
                "description": "Graduation ceremonies, final moments, and farewell celebrations",
                "color": "#F7DC6F",
                "order": 8,
                "is_active": True
            }
        ]
        
        # Create memory categories
        for category_data in categories_data:
            category, created = MemoryCategory.objects.get_or_create(
                name=category_data["name"],
                defaults={
                    "icon": category_data["icon"],
                    "description": category_data["description"],
                    "color": category_data["color"],
                    "order": category_data["order"],
                    "is_active": category_data["is_active"]
                }
            )
            
            if created:
                self.stdout.write(f"Created memory category: {category.name}")
            else:
                self.stdout.write(f"Memory category already exists: {category.name}")
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated memory categories!')
        )
