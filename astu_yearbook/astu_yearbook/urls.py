# astu_yearbook/urls.py (project-level)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin_url = getattr(settings, 'ADMIN_URL', 'admin/')

urlpatterns = [
    path(admin_url, admin.site.urls),
    path('yearbook/', include('yearbook.urls')),  # include app-level urls here
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    from django.views.static import serve
    urlpatterns += [
        path(f'{settings.MEDIA_URL.lstrip("/")}/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
