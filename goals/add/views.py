from django.shortcuts import render
from browse.forms import GoalForm, ChatForm
from .forms import AddGoalForm
from browse.models import Goal
from django.contrib.auth.models import User
from django.http import HttpResponse
from browse.validators import true_converter

def browse_add(request):
    data = {}
    add_form = AddGoalForm()
    form = GoalForm()
    chat_form = ChatForm()
    goals = Goal.objects.all()
    for goal in goals:
        goal.group = User.objects.get(id=goal.owner_id).groups.all()[0]
    return render(request, 'add/add.html', {'add_form': add_form, 'data': goals, 'form': form, 'chat_form': chat_form})

def add_goal(request):
    if request.method == 'POST' and request.user.is_authenticated:
        form = AddGoalForm(request.POST)
        if form.is_valid():
            goal = Goal(owner_id=request.user.id,
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