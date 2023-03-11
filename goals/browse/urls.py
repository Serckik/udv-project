from django.urls import path
from . import views

urlpatterns = [
    path('', views.browse), # главная
    path('edit', views.editing), # нужна авторизация! POST поля: (int goal_id, str name, str description, str block, int quarter, float weight, str planned)/edit - возвращает HttpResponse(успешно, ошибка)
    path('chat', views.chatting), # нужна авторизация! POST поля: (int goal_id, str message) - возвращает HttpResponse(Успешно, Ошибка)
    path('get_goal', views.get_goal),
]