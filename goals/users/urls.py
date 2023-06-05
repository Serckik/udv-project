from django.urls import path
from . import views
from .on_startup import create_groups

urlpatterns = [
    path('get_notifications', views.get_notifications),  # get
    path('read_notification', views.read_notification),  # post
    path('download_excel', views.download_excel),  # get
    path('upload_image', views.upload_image),  # post
]

try:
    create_groups()
except:
    pass
