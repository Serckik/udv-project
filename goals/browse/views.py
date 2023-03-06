from django.shortcuts import render
from .models import Goal
from .forms import GoalForm, ChatForm
from django.contrib.auth.models import User
import datetime
from datetime import datetime
from django.http import JsonResponse

def get_time() -> str:
    return datetime.today().strftime('%d-%m-%Y') + ' ' + datetime.now().strftime("%H:%M")

def update_history(goal, request):
    new_data = {'name': request.POST.get('name'), 'description': request.POST.get('description'),
                'block': request.POST.get('block'), 'quarter': str(request.POST.get('quarter')),
                'weight': float(request.POST.get('weight')), 'planned': request.POST.get('planned')}

    old_data = {'name': goal.name, 'description': goal.description, 'block': goal.block,
                'quarter': str(goal.quarter), 'weight': goal.weight, 'planned': goal.planned}

    translator = {'name': 'Название', 'description': 'Описание', 'block': 'Блок',
                  'quarter': 'Квартал', 'weight': 'Вес', 'planned': 'Запланированная'}
    
    

    for i in new_data:
        if old_data[i] != new_data[i]:
            goal.history['history'].append({'id': request.user.id, 'time': get_time(), 'field': translator[i], 'last': old_data[i], 'now': new_data[i]})
    goal.save(update_fields=['history'])

def browse(request):
    data = Goal.objects.all()
    return render(request, 'browse/browse.html', {'data': data})

def editing(request, goal_id):
    status = ''
    goal = Goal.objects.get(id=goal_id)
    if request.method == "POST":
        if request.user.is_authenticated and request.user.id == goal.owner_id or \
        request.user.is_superuser or request.user.groups.all()[0] == User.objects.get(id=goal.owner_id).groups.all()[0] \
        and request.user.has_perm('browse.change_goal'):
            form = GoalForm(request.POST)
            if form.is_valid():
                status = 'Успешно'
                update_history(goal, request)
                goal.name = request.POST.get('name')
                goal.description = request.POST.get('description')
                goal.block = request.POST.get('block')
                goal.quarter = request.POST.get('quarter')
                goal.weight = request.POST.get('weight')
                goal.planned = request.POST.get('planned')
                print(request.POST.get('planned'))
                goal.save(update_fields=['name', 'description', 'block', 'quarter', 'weight', 'planned'])
            else:
                status = 'Вес должен быть в диапазоне от 0 до 100'
        else:
            status = 'У вас недостаточно прав'
    form = GoalForm(initial={'name': goal.name, 'description': goal.description, 'block': goal.block,
                    'quarter': goal.quarter, 'weight': goal.weight, 'planned': goal.planned, })
    return render(request, 'browse/editing.html', {'data': goal, 'form': form, 'status': status})

def chatting(request, goal_id):
    goal = Goal.objects.get(id=goal_id)
    if request.method == "POST":
        message = {'id': request.user.id, 'time': get_time(), 'text': request.POST.get('message')}
        goal.chat['chat'].append(message)
        goal.save(update_fields=['chat'])
    form = ChatForm()
    messages = goal.chat['chat']
    for item in messages:
        item['name'] = User.objects.get(id=item['id']).get_full_name()
    return render(request, 'browse/chatting.html', {'form': form, 'data': goal.chat['chat']})

def history(request, goal_id):
    goal = Goal.objects.get(id=goal_id)
    messages = goal.history['history']
    for item in messages:
        item['name'] = User.objects.get(id=item['id']).get_full_name()
    return render(request, 'browse/history.html', {'data': goal.history['history']})

def test(request):
    if request.user.is_authenticated:
        return JsonResponse({'hello': 'chat'})
    else:
        return JsonResponse({'hello': 'PLEASE LOGIN'})
    