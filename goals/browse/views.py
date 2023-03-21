from django.shortcuts import render
from .models import Goal
from .forms import GoalForm, ChatForm
from django.contrib.auth.models import User
import datetime
from datetime import datetime
from django.http import JsonResponse, HttpResponse
from django.forms.models import model_to_dict
from .validators import goal_validator

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
                'fact_mark': int(request.POST.get('fact_mark'))
            }

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
                  'mark': 'Оценка сотрудинка',
                  'fact_mark': 'Оценка руководителя'}

 
    for i in new_data:
        if old_data[i] != new_data[i]:
            goal.history['history'].append({'id': request.user.id, 'time': get_time(), 'field': translator[i], 'last': old_data[i], 'now': new_data[i]})
    goal.save(update_fields=['history'])

def browse(request):
    data = Goal.objects.all()
    form = GoalForm()
    chat_form = ChatForm()
    return render(request, 'browse/browse.html', {'data': data, 'form': form, 'chat_form': chat_form})

def editing(request):
    if request.method == "POST":
        goal = Goal.objects.get(id=request.POST.get('goal_id'))
        if request.user.is_authenticated and request.user.id == goal.owner_id or \
        request.user.is_superuser or request.user.groups.all()[0] == User.objects.get(id=goal.owner_id).groups.all()[0] \
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
        message = {'id': request.user.id, 'time': get_time(), 'text': request.POST.get('message')}
        goal.chat['chat'].append(message)
        goal.save(update_fields=['chat'])
    return HttpResponse('Успешно')

def history(request, goal_id):
    goal = Goal.objects.get(id=goal_id)
    messages = goal.history['history']
    for item in messages:
        item['name'] = User.objects.get(id=item['id']).get_full_name()
    return render(request, 'browse/history.html', {'data': goal.history['history']})

def test(request):
    if request.method == "POST":
        print(request.POST.get('name'))
    if request.user.is_authenticated:
        return JsonResponse({'hello': 'chat'})
    else:
        return JsonResponse({'hello': 'PLEASE LOGIN'})

def get_goal(request):
    if request.user.is_authenticated:
<<<<<<< HEAD
        goal = Goal.objects.get(id=request.POST.get('goal_id'))
=======
        goal = Goal.objects.get(id=request.GET.get('goal_id'))
>>>>>>> 706f6360bef9efb0bb99e964d2ce76c34d747206
        messages = goal.history['history']
        for item in messages:
            item['name'] = User.objects.get(id=item['id']).get_full_name()
        messages = goal.chat['chat']
        for item in messages:
                item['name'] = User.objects.get(id=item['id']).get_full_name()
        return JsonResponse(model_to_dict(goal))
    else:
        return HttpResponse("Please login.")
    