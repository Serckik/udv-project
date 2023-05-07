from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('goal/',  include('browse.urls')),
    path('user/password_reset/', auth_views.PasswordResetView.as_view(
        html_email_template_name='registration/html_password_reset_email.html'
    )),
    path('user/',  include('django.contrib.auth.urls')),
    path('user/', include('users.urls')),
    path('', views.redirect),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
