from django.shortcuts import render
from django.views.decorators.cache import cache_control
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from .models import Notification
from django.forms.models import model_to_dict
from browse.models import Goal
from django.utils import timezone
from django.db.models import Q

@login_required(login_url='/user/login/')
@cache_control(no_cache=True, must_revalidate=True)
def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/user/login')

@login_required(login_url='/user/login/')
def get_notifications(request):
    active_notifi = []

    for notifi in Notification.objects.all():
        if notifi.is_active():
            active_notifi.append(notifi.id)

    notifi = Notification.objects.filter(id__in=active_notifi)
    notifi = notifi.filter(user=request.user).order_by('-created_at')

    notifi_list = list(notifi.values())
    for notifi in notifi_list:
        notifi['goal_name'] = Goal.objects.get(id=notifi['goal_id']).name
        
    return JsonResponse(notifi_list, safe=False)

@login_required(login_url='/user/login/')
def read_notification(request):
    notifi = Notification.objects.get(id=request.POST.get('id'))
    notifi.is_read = True
    notifi.save()
    return HttpResponse('Успешно')