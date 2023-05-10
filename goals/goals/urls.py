from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),  # admin
    path('goal/',  include('browse.urls')),  # browse(goals) app
    path('user/password_reset/', auth_views.PasswordResetView.as_view(
        html_email_template_name='registration/html_password_reset_email.html'
    )),  # password reset
    path('user/',  include('django.contrib.auth.urls')),  # django user
    path('user/', include('users.urls')),  # user app urls
    path('', views.redirect),  # home redirect
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
