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
from django.utils.timezone import localtime
import openpyxl
from django.http import HttpResponse
from tempfile import NamedTemporaryFile
import tempfile

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
        notifi['created_at'] = localtime(notifi['created_at'])
       
    return JsonResponse(notifi_list, safe=False)

@login_required(login_url='/user/login/')
def read_notification(request):
    notifi = Notification.objects.get(id=request.POST.get('id'))
    notifi.is_read = True
    notifi.save()
    return HttpResponse('Успешно')

@login_required(login_url='/user/login/')
def get_user_name(request):
    return JsonResponse({'name': request.user.get_full_name()})

@login_required(login_url='/user/login/')
def download_excel(request):
    # Создаем новый документ Excel
    wb = openpyxl.Workbook()
    
    # Получаем активный лист
    ws = wb.active
    
    # Записываем данные в ячейки
    ws['A1'] = 'Привет, мир!'
    
    # Создаем временный файл для сохранения документа Excel
    with NamedTemporaryFile(delete=True) as tmp_file:
        # Сохраняем документ во временный файл
        wb.save(tmp_file.name)
        
        # Открываем временный файл и читаем его содержимое
        with open(tmp_file.name, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment; filename=test.xlsx'
            return response