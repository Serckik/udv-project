from django.shortcuts import render
from django.views.decorators.cache import cache_control
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from .models import Notification
from django.forms.models import model_to_dict
from browse.models import Goal

@login_required(login_url='/user/login/')
@cache_control(no_cache=True, must_revalidate=True)
def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/user/login')

@login_required(login_url='/user/login/')
def get_notifications(request):
    notifi = Notification.objects.filter(user=request.user)
    notifi_list = list(notifi.values())
    for notifi in notifi_list:
        notifi['goal_name'] = Goal.objects.get(id=notifi['goal_id']).name
    return JsonResponse(notifi_list, safe=False)