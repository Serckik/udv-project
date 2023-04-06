from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('goal/',  include('browse.urls')),
    path('user/',  include('django.contrib.auth.urls')),
    path('user/', include('users.urls')),
    path('', views.redirect)
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
