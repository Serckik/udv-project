from django.shortcuts import render
from .models import Goal, Chat, History, FieldChange
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
                'weight': float(request.POST.get('weight')),
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

    if request.user == goal.owner_id:
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
    for i in new_data:
        if old_data[i] != new_data[i]:
            history.fieldchange_set.create(field=translator[i],
                                           old_data=old_data[i],
                                           new_data=new_data[i])
            
            
    notifi = Notification(is_goal=True,
                          user=goal.owner_id,
                          field=translator[i],
                          old_data=old_data[i],
                          new_data=new_data[i])       
     
    if goal.owner_id == request.user:
        users = User.objects.filter(groups__name=request.user.groups.all()[0])
        for user in users:
            if user.has_perm('browse.change_goal'):
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
            goal.weight = float(request.POST.get('weight'))
            goal.planned = true_converter[request.POST.get('planned')]
            goal.current_result = request.POST.get('current_result')
            goal.mark = int(request.POST.get('mark'))
            if not request.user == goal.owner_id:
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

        notifi = Notification(message=request.POST.get('message'),
                                user=goal.owner_id,
                                is_goal=False,)
        if goal.owner_id == request.user:
                users = User.objects.filter(groups__name=request.user.groups.all()[0])
                for user in users:
                    if user.has_perm('browse.change_goal'):
                        notifi.user=user
        notifi.save()
    return HttpResponse('Успешно')

@login_required(login_url='/user/login/')
def get_chat(request):
    goal = Goal.objects.get(id=request.GET.get('goal_id'))
    chats = goal.chat_set.all()
    chat_dict = {'chat': []}
    for chat in chats:
            chat_dict['chat'].append({'text': chat.message, 'time': chat.created_at, 'name': chat.owner_id.get_full_name()})
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
            goal_dict['chat'].append({'text': chat.message, 'time': chat.created_at, 'name': chat.owner_id.get_full_name()})
        for hist in histories:
            hist_fc = []
            for fc in hist.fieldchange_set.all():
                hist_fc.append(model_to_dict(fc))
            goal_dict['history'].append({'name': hist.owner_id.get_full_name(),
                                         'time': hist.created_at,
                                         'field_changes': hist_fc})
        goal_dict['user_name'] = User.objects.get(id=goal_dict['owner_id']).get_full_name()
        return JsonResponse(goal_dict)
    else:
        return HttpResponse("Please login.")

@login_required(login_url='/user/login/')
def get_goals_by_filter(request):
    goals = Goal.objects.all()
    goals = goals.filter(current=True)
    data = list(goals.values('name', 'weight', 'isdone', 'owner_id', 'block', 'id', 'quarter', 'planned'))
    for item in data:
        user_name = User.objects.get(id=item['owner_id']).get_full_name()
        item['owner_id'] = user_name
    return JsonResponse(data, safe=False)

@login_required(login_url='/user/login/')
def get_yours_non_approved_goals(request):
    goals = Goal.objects.all()
    goals = goals.filter(current=False, owner_id=request.user)
    data = list(goals.values('name', 'weight', 'isdone', 'owner_id', 'block', 'id', 'quarter', 'planned'))
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
def get_non_approve_goals(request):
    goals = Goal.objects.all()
    if request.user.has_perm('browse.change_goal'):
        goals = goals.filter(current=False)
        goals_list = []
        for goal in goals:
            if len(request.user.groups.all() & goal.owner_id.groups.all()) > 0 and request.user != goal.owner_id:
                goals_list.append(model_to_dict(goal))
        for goal in goals_list:
            user_name = User.objects.get(id=goal['owner_id']).get_full_name()
            goal['owner_id'] = user_name
        return JsonResponse(goals_list, safe=False)
    else:
        return HttpResponse('Нет прав')

@login_required(login_url='/user/login/')
def get_quarters(request):
    choices = [x[0] for x in CHOICES_QUARTER][1:]
    return JsonResponse(choices, safe=False)