from django.shortcuts import render
from browse.forms import GoalForm
from browse.models import Goal

def add(request):
    status = ''
    data = {}
    if request.method == 'POST':
        form = GoalForm(request.POST)
        if form.is_valid():
            goal = Goal(owner_id=request.user.id, name=request.POST.get('name'), 
                        description=request.POST.get('description'), block=request.POST.get('block'),
                        quarter=request.POST.get('quarter'), weight=request.POST.get('weight'),
                        current=False, planned=True if request.POST.get('planned') == 'on' else False,
                        chat={"chat": []}, history={"history": []})
            goal.save()
        else:
            data = {'name': request.POST.get('name'), 'description': request.POST.get('description'),
                    'block': request.POST.get('block'), 'quarter': request.POST.get('quarter'),
                    'weight': request.POST.get('weight'), 'planned': request.POST.get('planned')}
            status = 'Вес должен быть в диапазоне от 0 до 100'
    form = GoalForm(initial=data)
    return render(request, 'add/add.html', {'form': form, 'status': status})