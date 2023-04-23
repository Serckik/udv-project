from django.urls import path
from . import views

urlpatterns = [
    path('browse', views.browse),
    path('edit', views.editing),
    path('get_goal', views.get_goal),
    path('add', views.browse_add),
    path('approve', views.approve_goal),
    path('add_goal', views.add_goal),
    path('chat', views.chatting),
    path('get_goals', views.get_goals_by_filter),
    path('get_chat', views.get_chat),
    path('get_non_approved_goals', views.get_non_approve_goals),
    path('get_yours_non_approved_goals', views.get_yours_non_approved_goals)
]