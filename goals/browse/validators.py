from .forms import GoalForm


def goal_validator(request):
    form = GoalForm(request.POST)
    if form.is_valid():
        weight = float(request.POST.get('weight'))
        if weight < 0 or weight > 200:
            return False

        return True
    else:
        print(form.errors.as_data())
        return False


true_converter = {'true': True, 'True': True, 'False': False, 'false': False}