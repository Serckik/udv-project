from django.urls import path
from . import views

urlpatterns = [
    path('browse', views.browse),  # render
    path('add', views.browse_add),  # render
    path('approve', views.approve_goal),  # render
    path('summary', views.summary),  # render
    path('browse_summary', views.browse_summary),  # render
    path('edit', views.editing),  # post
    path('get_goal', views.get_goal),  # get
    path('add_goal', views.add_goal),  # post
    path('chat', views.chatting),  # post
    path('get_goals', views.get_goals_by_filter),  # get
    path('get_chat', views.get_chat),  # get
    path('get_quarters', views.get_quarters),  # get,
    path('delete_goal', views.delete_goal),  # post
    path('get_summaries', views.get_summaries),  # get
    path('add_summary', views.add_summary),  # post
    path('edit_summary', views.editing_summary),  # post
    path('delete_summary', views.delete_summary),  # post
    path('get_summary', views.get_summary),  # get
    path('download_summaries', views.download_summaries)  # get
]
