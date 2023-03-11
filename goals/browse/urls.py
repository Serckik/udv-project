from django.urls import path
from . import views

urlpatterns = [
    path('', views.browse),
    path('edit', views.editing),
    path('chat', views.chatting),
    path('history/<int:goal_id>', views.history),
    path('get_goal', views.get_goal),
    #TESTING
    path('test', views.test),
]