def goal_validator(request):
    errors = []
    name = request.POST.get('name')
    description = request.POST.get('description')
    block = request.POST.get('block')
    quarter = request.POST.get('quarter')
    weight = float(request.POST.get('weight'))
    planned = request.POST.get('planned')
    if weight < 0 or weight > 100:
        return False