from django.shortcuts import render
from .models import Goal, Chat, History, FieldChange, Quarter
from .forms import GoalForm, ChatForm, AddGoalForm
from django.contrib.auth.models import User
import datetime
from datetime import datetime
from django.http import JsonResponse, HttpResponse
from django.forms.models import model_to_dict
from .validators import goal_validator
from users.models import Notification
from django.contrib.auth.decorators import login_required
import math
import re
import json
from datetime import date
from django.utils.timezone import localtime
from .models import CHOICES_QUARTER

def split_text(text, max_length):
    words = re.findall(r'\b\w+\b', text)
    chunks = []
    current_chunk = ''
    for word in words:
        if len(current_chunk) + len(word) + 1 > max_length:
            chunks.append(current_chunk.strip())
            current_chunk = ''
        current_chunk += ' ' + word
    chunks.append(current_chunk.strip())
    true_chunks = []
    for chunk in chunks:
        true_chunks += [chunk[i:i+max_length] for i in range(0, len(chunk), max_length)]
    return true_chunks


true_converter = {'true': True, 'True': True, 'False': False, 'false': False}

@login_required(login_url='/user/login/')
def get_time() -> str:
    return datetime.today().strftime('%d-%m-%Y') + ' ' + datetime.now().strftime("%H:%M")

def update_history(goal, request):
    new_data = {'name': request.POST.get('name'),
                'description': request.POST.get('description'),
                'block': request.POST.get('block'),
                'quarter': request.POST.get('quarter'),
                'weight': int(request.POST.get('weight')),
                'planned': true_converter[request.POST.get('planned')],
                'current': true_converter[request.POST.get('current')],
                'current_result': request.POST.get('current_result'),
                'mark': int(request.POST.get('mark')),
                'fact_mark': int(request.POST.get('fact_mark'))}

    old_data = {'name': goal.name,
                'description': goal.description, 
                'block': goal.block,
                'quarter': goal.quarter, 
                'weight': goal.weight, 
                'planned': goal.planned,
                'current': goal.current,
                'current_result': goal.current_result,
                'mark': goal.mark,
                'fact_mark': goal.fact_mark}

    translator = {'name': 'Название',
                  'description': 'Образ результата', 
                  'block': 'Блок',
                  'quarter': 'Квартал', 
                  'weight': 'Вес', 
                  'planned': 'Запланированная',
                  'current': 'Утверждённая',
                  'current_result': 'Текущий результат',
                  'mark': 'Оценка сотрудника',
                  'fact_mark': 'Оценка руководителя'}

    if request.user == goal.owner_id and not request.user.is_superuser:
        new_data['fact_mark'] = old_data['fact_mark']
        new_data['current'] = old_data['current']

    is_change = False
    for i in new_data:
        if old_data[i] != new_data[i]:
            is_change = True
            break
    if not is_change:
        return

    history = History(goal=goal, owner_id=request.user)
    goal.history_set.add(history, bulk=False)
    
    notifi = Notification(is_goal=True,
                          user=goal.owner_id,
                          goal=goal)    

    for i in new_data:
        if old_data[i] != new_data[i]:
            if i == 'planned':
                print(old_data[i], new_data[i])
                old_data[i] = 'Запланированная' if old_data[i] else 'Незапланированная'
                new_data[i] = 'Запланированная' if new_data[i] else 'Незапланированная'
            if i == 'current':
                old_data[i] = 'Да' if old_data[i] else 'Нет'
                new_data[i] = 'Да' if new_data[i] else 'Нет'
            if i in ['mark', 'weight', 'fact_mark']:
                old_data[i] = str(old_data[i]) + '%'
                new_data[i] = str(new_data[i]) + '%'
            history.fieldchange_set.create(field=translator[i],
                                           old_data=old_data[i],
                                           new_data=new_data[i])
            
     
    if goal.owner_id == request.user:
        users = User.objects.filter(groups__in=request.user.groups.all())
        for user in users:
            if user.has_perm('browse.change_goal'):
                if user == request.user:
                    user = User.objects.get(is_superuser=True)
                notifi.user=user
    notifi.save()
    goal.save()

@login_required(login_url='/user/login/')
def browse(request):
    data = Goal.objects.all()
    form = GoalForm()
    chat_form = ChatForm()
    return render(request, 'browse/browse.html', {'data': data, 'form': form, 'chat_form': chat_form})

@login_required(login_url='/user/login/')
def editing(request):
    if request.method == "POST":
        goal = Goal.objects.get(id=request.POST.get('goal_id'))
        if request.user == goal.owner_id or \
        request.user.is_superuser or len(request.user.groups.all() & goal.owner_id.groups.all()) > 0 \
        and request.user.has_perm('browse.change_goal'):
            if not goal_validator(request):
                return HttpResponse('Ошибка')
            update_history(goal, request)
            goal.name = request.POST.get('name')
            goal.description = request.POST.get('description')
            goal.block = request.POST.get('block')
            goal.quarter = request.POST.get('quarter')
            goal.weight = int(request.POST.get('weight'))
            goal.planned = true_converter[request.POST.get('planned')]
            goal.current_result = request.POST.get('current_result')
            goal.mark = int(request.POST.get('mark'))
            if not request.user == goal.owner_id or request.user.is_superuser:
                goal.current = true_converter[request.POST.get('current')]
                goal.fact_mark = int(request.POST.get('fact_mark'))
            goal.save(update_fields=['name', 'description', 'block', 'quarter', 'weight', 'planned', 'current', 'current_result', 'mark', 'fact_mark'])
            return HttpResponse('Успешно')
        else:
            return HttpResponse('У вас недостаточно прав')

@login_required(login_url='/user/login/') 
def chatting(request):
    goal = Goal.objects.get(id=request.POST.get('goal_id'))
    if request.method == "POST":
        text = request.POST.get('message')
        for chunk in split_text(text, 2000):
            if len(chunk) > 0:
                goal.chat_set.create(owner_id=request.user, message=chunk)
        
        goal.save()

        notifi = Notification(goal=goal,
                              user=goal.owner_id,
                              is_goal=False,)
        if goal.owner_id == request.user:
                users = User.objects.filter(groups__name__in=request.user.groups.all())
                for user in users:
                    if user.has_perm('browse.change_goal'):
                        if user == request.user:
                            user = User.objects.get(is_superuser=True)
                        notifi.user=user
        notifi.save()
    return HttpResponse('Успешно')

@login_required(login_url='/user/login/')
def get_chat(request):
    goal = Goal.objects.get(id=request.GET.get('goal_id'))
    chats = goal.chat_set.all()
    chat_dict = {'chat': []}
    for chat in chats:
            chat_dict['chat'].append({'text': chat.message, 'time': localtime(chat.created_at), 'name': chat.owner_id.get_full_name()})
            #print(localtime(chat.created_at))
    return JsonResponse(chat_dict)

@login_required(login_url='/user/login/')
def get_goal(request):
    if request.user.is_authenticated:
        goal = Goal.objects.get(id=request.GET.get('goal_id'))
        goal_dict = model_to_dict(goal)
        chats = goal.chat_set.all()
        histories = goal.history_set.all()
        goal_dict['chat'] = []
        goal_dict['history'] = []
        for chat in chats:
            goal_dict['chat'].append({'text': chat.message, 'time': localtime(chat.created_at), 'name': chat.owner_id.get_full_name()})
        for hist in histories:
            hist_fc = []
            for fc in hist.fieldchange_set.all():
                hist_fc.append(model_to_dict(fc))
            goal_dict['history'].append({'name': hist.owner_id.get_full_name(),
                                         'time': localtime(hist.created_at),
                                         'field_changes': hist_fc})
        goal_dict['user_name'] = User.objects.get(id=goal_dict['owner_id']).get_full_name()
        goal_dict['admin_rights'] = len(request.user.groups.all() & goal.owner_id.groups.all()) > 0 \
            and request.user != goal.owner_id \
            and request.user.has_perm('browse.change_goal')
        if request.user.is_superuser:
            goal_dict['admin_rights'] = True
        goal_dict['rights'] = goal.owner_id == request.user
        if goal_dict['admin_rights']:
            goal_dict['rights'] = True
        return JsonResponse(goal_dict)
    else:
        return HttpResponse("Please login.")

@login_required(login_url='/user/login/')
def get_goals_by_filter(request):
    goals = Goal.objects.all()
    block = request.GET.get('block') if request.GET.get('block') != 'Все' else None
    sorting = request.GET.get('sort') if request.GET.get('sort') != 'Все' else None
    planned = request.GET.get('planned') if request.GET.get('planned') != 'Все' else None
    my = true_converter[request.GET.get('self')]
    search = request.GET.get('search')
    quarters = request.GET.getlist('quarter[]')
    current = true_converter[request.GET.get('current')]
    approve = true_converter[request.GET.get('approve')]
    done = request.GET.get('done') if request.GET.get('done') != 'Все' else None
    if approve:
        goals = goals.filter(owner_id__groups__in=request.user.groups.all()).exclude(owner_id=request.user)
    if block:
        goals = goals.filter(block=block)
    if sorting:
        if sorting == 'weight':
            goals = goals.order_by('-'+sorting)
        else:
            goals = goals.order_by(sorting)
    if planned:
        goals = goals.filter(planned=True if planned == 'Запланированная' else False)
    if my:
        goals = goals.filter(owner_id=request.user)
    if search:
        q2 = goals.filter(name__icontains=search)
        q3 = goals.filter(description__icontains=search)
        q4 = goals.filter(current_result__icontains=search)
        q5 = goals.filter(owner_id__first_name__icontains=search)
        q6 = goals.filter(owner_id__last_name__icontains=search)
        goals = q2 | q3 | q4 | q5 | q6
    if quarters:
        goals = goals.filter(quarter__in=quarters)
    goals = goals.filter(current=current)
    if done:
        goals = goals.filter(isdone=True if done == 'Выполненные' else False)
    
    data = list(goals.values('name', 'weight', 'isdone', 'owner_id', 'block', 'id'))
    for item in data:
        user_name = User.objects.get(id=item['owner_id']).get_full_name()
        item['owner_id'] = user_name
    
    return JsonResponse(data, safe=False)

@login_required(login_url='/user/login/')
def browse_add(request):
    data = {}
    add_form = AddGoalForm()
    form = GoalForm()
    chat_form = ChatForm()
    goals = Goal.objects.all()
    for goal in goals:
        goal.group = goal.owner_id.groups.all()[0]
    return render(request, 'browse/add.html', {'add_form': add_form, 'data': goals, 'form': form, 'chat_form': chat_form})

@login_required(login_url='/user/login/')
def add_goal(request):
    if request.method == 'POST' and request.user.is_authenticated:
        form = AddGoalForm(request.POST)
        if form.is_valid():
            goal = Goal(owner_id=request.user,
                        name=request.POST.get('name'), 
                        description=request.POST.get('description'), 
                        block=request.POST.get('block'),
                        quarter=request.POST.get('quarter'), 
                        weight=float(request.POST.get('weight')),
                        current=False,
                        current_result='',
                        planned=true_converter[request.POST.get('planned')],
                        mark=0,
                        fact_mark=0,
                        isdone=False)
            goal.save()
            return HttpResponse('Успешно')
        else:
            print(form.errors.as_data())
            return HttpResponse('Ошибка')

@login_required(login_url='/user/login/')
def approve_goal(request):
    if request.user.has_perm('browse.change_goal'):
        return render(request, 'browse/approve.html')  
    else:
        return HttpResponse('Нет прав')

@login_required(login_url='/user/login/')
def get_quarters(request):
    choices_Q = [(i.quarter, i.quarter) for i in Quarter.objects.all()]
    choices = sorted([x[0] for x in choices_Q], key=lambda x: (x.split()[2], x.split()[0]), reverse=True)
    now = datetime.now()
    current_year = date.today().year
    quarter_of_the_year = f'{(now.month-1)//3+1}'
    d = {'quarters': choices}
    d['current_quarter'] = f'{quarter_of_the_year} квартал {current_year}'
    #print(d)
    return JsonResponse(d)