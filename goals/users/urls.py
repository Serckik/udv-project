from django.urls import path
from . import views


urlpatterns = [
    path('get_notifications', views.get_notifications),  # get
    path('read_notification', views.read_notification),  # post
    path('get_user_name', views.get_user_name),  # get
    path('download_excel', views.download_excel),  # get
    path('upload_image', views.upload_image),  # post
]
