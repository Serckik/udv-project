from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',  include('browse.urls')),
    path('add/', include('add.urls')),
    path('profile/',  include('django.contrib.auth.urls')),
    path('summary/', include('summary.urls')) 
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
