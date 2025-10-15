# yearbook/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'departments', views.DepartmentViewSet)
router.register(r'students', views.StudentViewSet)
router.register(r'faculty', views.FacultyTributeViewSet)
router.register(r'director-general', views.DirectorGeneralMessageViewSet)
router.register(r'cyber-talent-director', views.CyberTalentDirectorMessageViewSet)
router.register(r'memory-categories', views.MemoryCategoryViewSet)
router.register(r'memories', views.MemoryBoardViewSet)
router.register(r'trainees', views.TraineeSuccessStoryViewSet)
router.register(r'about', views.AboutINSAViewSet)
router.register(r'leadership', views.LeadershipViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/health/', views.health_check, name='health_check'),
    path('verify/<str:student_id>/', views.verify_certificate_view, name='verify_certificate'),
]