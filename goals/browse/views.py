from django.shortcuts import render
from .models import Goal
from .forms import GoalForm, ChatForm
from django.contrib.auth.models import User
import json
import datetime
from datetime import date, datetime

def get_time() -> str:
    return datetime.today().strftime('%d-%m-%Y') + ' ' + datetime.now().strftime("%H:%M")

def update_history(goal, request):
    new_data = {'name': request.POST.get('name')}
    old_data = {'name': goal.name}
    translator = {'name': 'Название'}

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
            status = 'Успешно'
            update_history(goal, request)
            goal.name = request.POST.get('name')
            goal.save(update_fields=['name'])
        else:
            status = 'У вас недостаточно прав'
    form = GoalForm(initial={'name': goal.name})
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
