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
from openpyxl.styles import Font, Alignment
from openpyxl.styles.borders import Border, Side
from openpyxl.styles import PatternFill
from urllib.parse import quote


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
    wb = openpyxl.Workbook()
    quarter = request.GET.get('quarter')
    goals = list(Goal.objects.filter(owner_id=request.user, quarter=quarter, current=True).values())
    goals_count = len(goals)
    ws = wb.active
    thin_border = Border(left=Side(style='thin'), 
                     right=Side(style='thin'), 
                     top=Side(style='thin'), 
                     bottom=Side(style='thin'))

    ws['A2'] = f'Сводка за {quarter} {request.user.get_full_name()}'
    ws['A2'].font = Font(bold=True, size=14)
    ws['A2'].alignment = Alignment(horizontal="center")
    ws['A2'].border = thin_border
    ws.merge_cells('A2:H2')

    ws['A3'] = 'Название задачи'
    ws['A3'].alignment = Alignment(horizontal="center")
    ws['A3'].border = thin_border
    ws.merge_cells('A3:E3')

    ws['F3'] = 'Вес, %'
    ws['F3'].alignment = Alignment(horizontal="center")
    ws['F3'].border = thin_border

    ws['G3'] = 'Оценка, %'
    ws['G3'].alignment = Alignment(horizontal="center")
    ws.column_dimensions['G'].width = 13
    ws['G3'].border = thin_border
    
    ws['H3'] = 'Итог'
    ws['H3'].alignment = Alignment(horizontal="center")
    ws['H3'].border = thin_border

    ws['J3'] = 'Итоговый коэффициент:'
    ws['J3'].fill = PatternFill(start_color='FFC000',
                                end_color='FFC000',
                                fill_type='solid')
    ws['J3'].alignment = Alignment(horizontal="center")
    ws['J3'].border = Border(left=Side(style='medium'), 
                     top=Side(style='medium'), 
                     bottom=Side(style='medium'))
    ws.merge_cells('J3:L3')

    ws['M3'] = f'=SUM(H4:H{4+goals_count})'
    ws['M3'].alignment = Alignment(horizontal="right")
    ws['M3'].fill = PatternFill(start_color='D9D9D9',
                                end_color='D9D9D9',
                                fill_type='solid')
    ws['M3'].border = Border(right=Side(style='medium'), 
                            top=Side(style='medium'), 
                            bottom=Side(style='medium'))

    for row, goal in zip(ws[f'A4:A{goals_count+4}'], goals):
        for cell in row:
            cell.border = thin_border
            cell.value = goal['name']
            cell.alignment = Alignment(horizontal="center")
            number = int(''.join(filter(str.isdigit, cell.coordinate)))
            ws.merge_cells(f'{cell.coordinate}:E{number}')

    for row_idx, goal in enumerate(goals, start=4):
        cell = ws.cell(row=row_idx, column=6, value=goal['weight'])
        cell.border = thin_border
        cell.alignment = Alignment(horizontal="right")
        cell = ws.cell(row=row_idx, column=7, value=goal['fact_mark'])
        cell.border = thin_border
        cell.alignment = Alignment(horizontal="right")
        cell = ws.cell(row=row_idx, column=8, value=f"=F{row_idx}/100 * G{row_idx}/100")
        cell.border = thin_border
        cell.alignment = Alignment(horizontal="right")

    with NamedTemporaryFile(delete=True) as tmp_file:
        wb.save(tmp_file.name)
        title = f'Сводка за {quarter} {request.user.get_full_name()}'
        with open(tmp_file.name, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = f'attachment; filename*=UTF-8\'\'{quote(title)}.xlsx'
            return response