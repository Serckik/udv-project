from django.urls import path
from . import views

urlpatterns = [
    path('', views.browse),
    path('edit/<int:goal_id>', views.editing),
    path('chat/<int:goal_id>', views.chatting),
    path('history/<int:goal_id>', views.history),
    #TESTING
    path('test', views.test),
]