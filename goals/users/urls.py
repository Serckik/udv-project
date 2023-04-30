from django.urls import path
from . import views

urlpatterns = [
    path('logout', views.logout_user),
    path('get_notifications', views.get_notifications)
]