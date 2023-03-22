from django.urls import path
from . import views

urlpatterns = [
    path('browse', views.browse),
    path('edit', views.editing),
    path('get_goal', views.get_goal),
    path('add', views.browse_add),
    path('approve', views.approve_goal),
    path('add_goal', views.add_goal)
]