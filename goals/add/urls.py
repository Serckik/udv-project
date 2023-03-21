from django.urls import path
from . import views

urlpatterns = [
    path('', views.browse_add),
    path('add_goal', views.add_goal)
]