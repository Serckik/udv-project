from django.shortcuts import render
from .models import Goal
from .forms import GoalForm, ChatForm, AddGoalForm
from django.contrib.auth.models import User
import datetime
from datetime import datetime
from django.http import JsonResponse, HttpResponse
from django.forms.models import model_to_dict
from .validators import goal_validator
from users.models import Notification

true_converter = {'true': True, 'True': True, 'False': False, 'false': False}

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
    
    for i in new_data:
        if old_data[i] != new_data[i]:
            data = {'name': request.user.get_full_name(),
                    'time': get_time(), 
                    'field': translator[i], 
                    'last': old_data[i], 
                    'now': new_data[i]}
            
            notifi = Notification(is_goal=True,
                                  user=goal.owner_id,
                                  field=data['field'],
                                  old_data=data['last'],
                                  new_data=data['now'])
            notifi.save()
            goal.history['history'].append(data)
    goal.save(update_fields=['history'])

def browse(request):
    data = Goal.objects.all()
    form = GoalForm()
    chat_form = ChatForm()
    return render(request, 'browse/browse.html', {'data': data, 'form': form, 'chat_form': chat_form})

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
            
def chatting(request):
    goal = Goal.objects.get(id=request.POST.get('goal_id'))
    if request.method == "POST":
        message = {'name': request.user.get_full_name(), 'time': get_time(), 'text': request.POST.get('message')}
        goal.chat['chat'].append(message)
        goal.save(update_fields=['chat'])
        notifi = Notification(message=message['text'],
                              user=goal.owner_id,
                              is_goal=False,)
        notifi.save()
    return HttpResponse('Успешно')

def history(request, goal_id):
    goal = Goal.objects.get(id=goal_id)
    messages = goal.history['history']
    for item in messages:
        item['name'] = User.objects.get(id=item['id']).get_full_name()
    return render(request, 'browse/history.html', {'data': goal.history['history']})

def get_goal(request):
    if request.user.is_authenticated:
        goal = Goal.objects.get(id=request.GET.get('goal_id'))
        return JsonResponse(model_to_dict(goal))
    else:
        return HttpResponse("Please login.")

def browse_add(request):
    data = {}
    add_form = AddGoalForm()
    form = GoalForm()
    chat_form = ChatForm()
    goals = Goal.objects.all()
    for goal in goals:
        goal.group = goal.owner_id.groups.all()[0]
    return render(request, 'browse/add.html', {'add_form': add_form, 'data': goals, 'form': form, 'chat_form': chat_form})

def add_goal(request):
    if request.method == 'POST' and request.user.is_authenticated:
        form = AddGoalForm(request.POST)
        if form.is_valid():
            goal = Goal(owner_id=request.user,
                        name=request.POST.get('name'), 
                        description=request.POST.get('description'), 
                        block=request.POST.get('block'),
                        quarter=int(request.POST.get('quarter')), 
                        weight=float(request.POST.get('weight')),
                        current=False,
                        current_result='',
                        planned=true_converter[request.POST.get('planned')],
                        chat={"chat": []},
                        history={"history": []},
                        mark=0,
                        fact_mark=0)
            goal.save()
            return HttpResponse('Успешно')
        else:
            return HttpResponse('Ошибка')

def approve_goal(request):
    goals = Goal.objects.all()
    if request.user.has_perm('browse.change_goal'):
        for goal in goals:
            goal.group = goal.owner_id.groups.all()[0]
        return render(request, 'browse/approve.html', {'data': goals})  
    else:
        return HttpResponse('Нет прав')