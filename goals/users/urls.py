from django.urls import path
from . import views


urlpatterns = [
    path('logout', views.logout_user),
    path('get_notifications', views.get_notifications),
    path('read_notification', views.read_notification),
    path('get_user_name', views.get_user_name),
    path('download_excel', views.download_excel),
    
]