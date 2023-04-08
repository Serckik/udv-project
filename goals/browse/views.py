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

true_converter = {'true': True, 'True': True, 'False': False, 'false': False}

@login_required(login_url='/user/login/')
def get_time() -> str:
    return datetime.today().strftime('%d-%m-%Y') + ' ' + datetime.now().strftime("%H:%M")

def update_history(goal, request):
    new_data = {'name': request.POST.get('name'),
                'description': request.POST.get('description'),
                'block': request.POST.get('block'),
                'quarter': int(request.POST.get('quarter')),
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
        if request.user.is_authenticated and request.user == goal.owner_id or \
        request.user.is_superuser or request.user.groups.all()[0] == goal.owner_id.groups.all()[0] \
        and request.user.has_perm('browse.change_goal'):
            if not goal_validator(request):
                return HttpResponse('Ошибка')
            update_history(goal, request)
            goal.name = request.POST.get('name')
            goal.description = request.POST.get('description')
            goal.block = request.POST.get('block')
            goal.quarter = int(request.POST.get('quarter'))
            goal.weight = float(request.POST.get('weight'))
            goal.planned = true_converter[request.POST.get('planned')]
            goal.current = true_converter[request.POST.get('current')]
            goal.current_result = request.POST.get('current_result')
            goal.mark = int(request.POST.get('mark'))
            goal.fact_mark = int(request.POST.get('fact_mark'))
            goal.save(update_fields=['name', 'description', 'block', 'quarter', 'weight', 'planned', 'current', 'current_result', 'mark', 'fact_mark'])
            return HttpResponse('Успешно')
        else:
            return HttpResponse('У вас недостаточно прав')

@login_required(login_url='/user/login/') 
def chatting(request):
    goal = Goal.objects.get(id=request.POST.get('goal_id'))
    if request.method == "POST":
        goal.chat_set.create(owner_id=request.user, message=request.POST.get('message'))
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
def history(request, goal_id):
    goal = Goal.objects.get(id=goal_id)
    messages = goal.history['history']
    for item in messages:
        item['name'] = User.objects.get(id=item['id']).get_full_name()
    return render(request, 'browse/history.html', {'data': goal.history['history']})

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
    block = request.GET.get('block')
    planned = request.GET.get('planned')
    done = request.GET.get('done')
    current = request.GET.get('current')
    quarter = math.ceil(datetime.now().month/3.)
    goals = Goal.objects.all()
    if block:
        goals = goals.filter(block=block)
    if planned:
        goals = goals.filter(planned=true_converter[planned])
    if done:
        goals = goals.filter(isdone=true_converter[done])
    if current:
        goals = goals.filter(current=true_converter[current])
    else:
        goals = goals.filter(current=False)


        
    data = list(goals.values('name', 'weight', 'isdone', 'owner_id', 'block', 'id'))
    for item in data:
        user_name = User.objects.get(id=item['owner_id']).get_full_name().split()
        user_name = user_name[0] + ' ' + user_name[1][0] + '.'
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
                        chat={"chat": []},
                        history={"history": []},
                        mark=0,
                        fact_mark=0,
                        isdone=False)
            goal.save()
            return HttpResponse('Успешно')
        else:
            return HttpResponse('Ошибка')

@login_required(login_url='/user/login/')
def approve_goal(request):
    goals = Goal.objects.all()
    if request.user.has_perm('browse.change_goal'):
        for goal in goals:
            goal.group = goal.owner_id.groups.all()[0]
        return render(request, 'browse/approve.html', {'data': goals})  
    else:
        return HttpResponse('Нет прав')