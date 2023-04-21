from .forms import GoalForm

def goal_validator(request):
    form = GoalForm(request.POST)
    if form.is_valid():
        errors = []
        name = request.POST.get('name')
        description = request.POST.get('description')
        block = request.POST.get('block')
        quarter = request.POST.get('quarter')
        weight = float(request.POST.get('weight'))
        planned = request.POST.get('planned')
        if weight < 0 or weight > 200:
            return False

        return True
    else:
        print(form.errors.as_data())
        return False


true_converter = {'true': True, 'True': True, 'False': False, 'false': False}