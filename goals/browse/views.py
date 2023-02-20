from django.shortcuts import render
from .models import Goal
from .forms import GoalForm

def browse(request):
    data = Goal.objects.all()
    return render(request, 'browse/browse.html', {'data': data})

def editing(request, goal_id):
    status = ''
    goal = Goal.objects.get(id=goal_id)
    if request.method == "POST":
        status = 'Успешно'
        goal.owner = request.POST.get('owner')
        goal.save(update_fields=['owner'])
    form = GoalForm()
    return render(request, 'browse/editing.html', {'data': goal, 'form': form, 'status': status})