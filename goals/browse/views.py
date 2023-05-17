from django.shortcuts import render
from .models import Goal, Quarter, Summary
from .forms import AddGoalForm, SummaryForm, EditSummaryForm
from django.contrib.auth.models import User
import datetime
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .validators import goal_validator
from django.contrib.auth.decorators import login_required
from datetime import date
from django.utils.timezone import localtime
from django.db.models import Q
from django.contrib.auth.models import Permission
from .database_client import true_converter, edit_goal, \
    send_message, edit_summary


@login_required(login_url='/user/login/')
def browse(request):
    return render(request, 'browse/browse.html')


@login_required(login_url='/user/login/')
def browse_add(request):
    return render(request, 'browse/add.html')


@login_required(login_url='/user/login/')
def approve_goal(request):
    if request.user.has_perm('browse.change_goal'):
        return render(request, 'browse/approve.html')


@login_required(login_url='/user/login/')
def summary(request):
    return render(request, 'browse/summary.html')


@login_required(login_url='/user/login/')
def browse_summary(request):
    return render(request, 'browse/browse_summary.html')


@login_required(login_url='/user/login/')
def editing(request):
    if request.method == "POST":
        goal = Goal.objects.get(id=request.POST.get('goal_id'))
        if (request.user == goal.owner_id or
                request.user.is_superuser or
                len(request.user.groups.all() &
                    goal.owner_id.groups.all()) > 0 and
                request.user.has_perm('browse.change_goal')):
            if not goal_validator(request):
                return JsonResponse({'status': 'validation error'})
            edit_goal(request, goal)
            return JsonResponse({'status': 'ok'})
        else:
            return JsonResponse({'status': '403 forbidden'})


@login_required(login_url='/user/login/')
def chatting(request):
    if request.method == "POST":
        goal = Goal.objects.get(id=request.POST.get('goal_id'))
        send_message(request, goal)
        return JsonResponse({'status': 'ok'})


@login_required(login_url='/user/login/')
def get_chat(request):
    goal = Goal.objects.get(id=request.GET.get('goal_id'))
    chats = goal.chat_set.all()
    chat_dict = {'chat': []}
    for chat in chats:
        chat_dict['chat'].append({'text': chat.message,
                                  'time': localtime(chat.created_at),
                                  'name': chat.owner_id.get_full_name(),
                                  'user_id': chat.owner_id.id})
    return JsonResponse(chat_dict)


@login_required(login_url='/user/login/')
def get_goal(request):
    goal = Goal.objects.get(id=request.GET.get('goal_id'))
    goal_dict = model_to_dict(goal)
    chats = goal.chat_set.all()
    histories = goal.history_set.all()
    goal_dict['chat'] = []
    goal_dict['history'] = []
    for chat in chats:
        goal_dict['chat'].append({'text': chat.message,
                                  'time': localtime(chat.created_at),
                                  'name': chat.owner_id.get_full_name()})
    for hist in histories:
        hist_fc = []
        for fc in hist.fieldchange_set.all():
            hist_fc.append(model_to_dict(fc))
        goal_dict['history'].append({'name': hist.owner_id.get_full_name(),
                                     'time': localtime(hist.created_at),
                                     'field_changes': hist_fc})
    goal_dict['user_name'] = User.objects.get(
        id=goal_dict['owner_id']).get_full_name()
    goal_dict['admin_rights'] = \
        len(request.user.groups.all() &
            goal.owner_id.groups.all()) > 0 and \
        request.user != goal.owner_id and \
        request.user.has_perm('browse.change_goal')
    if request.user.is_superuser:
        goal_dict['admin_rights'] = True
    goal_dict['rights'] = goal.owner_id == request.user
    if goal_dict['admin_rights']:
        goal_dict['rights'] = True
    return JsonResponse(goal_dict)


@login_required(login_url='/user/login/')
def get_goals_by_filter(request):
    goals = Goal.objects.all()
    block = request.GET.get('block') \
        if request.GET.get('block') != 'Все' else None
    sorting = request.GET.get('sort') \
        if request.GET.get('sort') != 'Все' else None
    planned = request.GET.get('planned') \
        if request.GET.get('planned') != 'Все' else None
    done = request.GET.get('done') \
        if request.GET.get('done') != 'Все' else None
    picked = request.GET.get('picked') \
        if request.GET.get('picked') != 'Все' else None
    my = true_converter[request.GET.get('self')]
    search = request.GET.get('search')
    quarters = request.GET.getlist('quarter[]')
    current = true_converter[request.GET.get('current')]
    approve = true_converter[request.GET.get('approve')]

    if approve:
        if request.user.is_superuser:
            perm = Permission.objects.get(codename='change_goal')
            goals = goals.filter(Q(owner_id__groups__permissions=perm) |
                                 Q(owner_id__user_permissions=perm)).distinct()
        else:
            goals = goals.filter(
                owner_id__groups__in=request.user.groups.all())
            goals = goals.exclude(owner_id=request.user)

    if block:
        goals = goals.filter(block=block)

    if sorting:
        if sorting == 'weight':
            goals = goals.order_by('-'+sorting)
        else:
            goals = goals.order_by(sorting)

    if planned:
        goals = goals.filter(planned=True
                             if planned == 'Запланированная' else False)

    if my:
        goals = goals.filter(owner_id=request.user)

    if search:
        search = search.strip()
        q2 = goals.filter(name__icontains=search)
        q3 = goals.filter(description__icontains=search)
        q4 = goals.filter(current_result__icontains=search)
        splitted_search = search.split()
        q5 = Goal.objects.none()
        if len(splitted_search) == 1:
            q5 = goals.filter(owner_id__first_name__icontains=search)
            q6 = goals.filter(owner_id__last_name__icontains=search)
        elif len(splitted_search) == 2:
            q5 = goals.filter(
                owner_id__first_name__icontains=splitted_search[0],
                owner_id__last_name__icontains=splitted_search[1])
            q6 = goals.filter(
                owner_id__first_name__icontains=splitted_search[1],
                owner_id__last_name__icontains=splitted_search[0])
        else:
            q5 = Goal.objects.none()
            q6 = Goal.objects.none()
        goals = q2 | q3 | q4 | q5 | q6
    if quarters:
        goals = goals.filter(quarter__in=quarters)
    goals = goals.filter(current=current)
    if done:
        goals = goals.filter(isdone=True if done == 'Выполненные' else False)
    if picked:
        all_summaries = Summary.objects.all()
        intersection = Goal.objects.all()
        if len(all_summaries) == 0:
            intersection = Goal.objects.none()
        for summary in all_summaries:
            intersection &= summary.goals.all()
        picked_filtered_goals = intersection if picked == 'Включено' \
            else Goal.objects.all().exclude(pk__in=intersection)
        goals &= picked_filtered_goals

    data = list(goals.values('name',
                             'weight',
                             'isdone',
                             'owner_id',
                             'block',
                             'id',
                             'quarter'))
    for item in data:
        user = User.objects.get(id=item['owner_id'])
        item['owner'] = user.get_full_name()
        item['owner_id'] = user.id

    return JsonResponse(data, safe=False)


@login_required(login_url='/user/login/')
def add_goal(request):
    if request.method == 'POST':
        form = AddGoalForm(request.POST)
        if form.is_valid():
            goal = Goal(owner_id=request.user,
                        name=request.POST.get('name'),
                        description=request.POST.get('description'),
                        block=request.POST.get('block'),
                        quarter=request.POST.get('quarter'),
                        weight=float(request.POST.get('weight')),
                        current=False,
                        current_result='',
                        planned=true_converter[request.POST.get('planned')],
                        mark=0,
                        fact_mark=0,
                        isdone=False)
            goal.save()
            return JsonResponse({'status': 'ok'})
        else:
            return JsonResponse({'status': 'validation error'})


@login_required(login_url='/user/login/')
def delete_goal(request):
    if request.method == 'POST':
        goal = Goal.objects.get(id=request.POST.get('goal_id'))
        if not goal.current:
            goal.delete()
            return JsonResponse({'status': 'ok'})
        else:
            return JsonResponse({'status':
                                 'Утверждённые задачи нельзя удалить'})


@login_required(login_url='/user/login/')
def get_summaries(request):
    block = request.GET.get('block') \
        if request.GET.get('block') != 'Все' else None
    quarter = request.GET.get('quarter')
    search = request.GET.get('search')
    summaries = Summary.objects.all()
    if block:
        summaries = summaries.filter(block=block)
    if quarter:
        summaries = summaries.filter(quarter=quarter)
    if search:
        search = search.strip()
        q1 = summaries.filter(name__icontains=search)
        q2 = summaries.filter(plan__icontains=search)
        q3 = summaries.filter(fact__icontains=search)
        summaries = q1 | q2 | q3
    return JsonResponse(list(summaries.values()), safe=False)


@login_required(login_url='/user/login/')
def get_summary(request):
    summary = Summary.objects.get(id=request.GET.get('summary_id'))
    summary_dict = model_to_dict(summary)
    goal_ids = []
    for goal in summary_dict['goals']:
        g = model_to_dict(goal)
        g['owner'] = goal.owner_id.get_full_name()
        goal_ids.append(g)
    summary_dict['goals'] = goal_ids
    return JsonResponse(summary_dict)


@login_required(login_url='/user/login/')
def add_summary(request):
    if request.method == 'POST':
        form = SummaryForm(request.POST)
        if form.is_valid():
            summary = Summary(plan=request.POST.get('plan'),
                              fact=request.POST.get('fact'),
                              block=request.POST.get('block'),
                              quarter=request.POST.get('quarter'),
                              name=request.POST.get('name'),
                              average_mark=0)
            summary.save()
            summary.goals.set(Goal.objects.filter(
                pk__in=request.POST.getlist('goals[]')))
            summary.save()
            return JsonResponse({'status': 'ok'})
        else:
            return JsonResponse({'status': 'validation error',
                                'error': form.errors})


@login_required(login_url='/user/login/')
def editing_summary(request):
    if request.method == "POST":
        summary = Summary.objects.get(id=request.POST.get('summary_id'))
        if request.user.is_superuser:
            form = EditSummaryForm(request.POST)
            if form.is_valid():
                edit_summary(request, summary)
                return JsonResponse({'status': 'ok'})
            else:
                return JsonResponse({'status': 'validation error'})
        else:
            return JsonResponse({'status': '403 forbidden'})


@login_required(login_url='/user/login/')
def delete_summary(request):
    if request.method == 'POST':
        summary = Goal.objects.get(id=request.POST.get('summary_id'))
        summary.delete()
        return JsonResponse({'status': 'ok'})


@login_required(login_url='/user/login/')
def get_quarters(request):
    now = datetime.datetime.now()
    current_year = date.today().year
    quarter_of_the_year = int(f'{(now.month-1)//3+1}')
    current_quarter_string = f'{quarter_of_the_year} квартал {current_year}'
    if len(Quarter.objects.all()) == 0:
        new_quarter = Quarter(quarter=current_quarter_string)
        new_quarter.save()
    last_quarter_model = Quarter.objects.last().quarter.split()
    last_quarter = int(last_quarter_model[0])
    last_year = int(last_quarter_model[2])

    if current_quarter_string == ' '.join(last_quarter_model):
        last_quarter += 1
        if last_quarter == 5:
            last_quarter = 1
            last_year += 1
        new_quarter = Quarter(quarter=f'{last_quarter} квартал {last_year}')
        new_quarter.save()

    all_quarters = [(quarter.quarter, quarter.quarter)
                    for quarter in Quarter.objects.all()]
    choices = sorted([quarter[0] for quarter in all_quarters],
                     key=lambda quarter: (quarter.split()[2],
                                          quarter.split()[0]), reverse=True)

    data = {'quarters': choices, 'current_quarter': current_quarter_string}

    return JsonResponse(data)
