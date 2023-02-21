from django.shortcuts import render
from .models import Goal
from .forms import GoalForm
from django.contrib.auth.models import User

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
            goal.name = request.POST.get('name')
            goal.save(update_fields=['name'])
        else:
            status = 'У вас недостаточно прав'
    form = GoalForm(initial={'name': goal.name})
    return render(request, 'browse/editing.html', {'data': goal, 'form': form, 'status': status})