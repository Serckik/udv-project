from users.models import Notification
from .models import History
from django.contrib.auth.models import User
import re

true_converter = {'true': True, 'True': True, 'False': False, 'false': False}


def split_text(text, max_length):
    words = re.findall(r'\S+', text)
    chunks = []
    current_chunk = ''
    for word in words:
        if len(current_chunk) + len(word) + 1 > max_length:
            chunks.append(current_chunk.strip())
            current_chunk = ''
        current_chunk += ' ' + word
    chunks.append(current_chunk.strip())
    true_chunks = []
    for chunk in chunks:
        true_chunks += [chunk[i:i+max_length] for i in range(0, len(chunk),
                                                             max_length)]
    return true_chunks


def update_history(goal, request):
    new_data = {'name': request.POST.get('name'),
                'description': request.POST.get('description'),
                'block': request.POST.get('block'),
                'quarter': request.POST.get('quarter'),
                'weight': int(request.POST.get('weight')),
                'planned': true_converter[request.POST.get('planned')],
                'current': true_converter[request.POST.get('current')],
                'current_result': request.POST.get('current_result'),
                'mark': int(request.POST.get('mark')),
                'fact_mark': int(request.POST.get('fact_mark')),
                'isdone': true_converter[request.POST.get('is_done')]}

    old_data = {'name': goal.name,
                'description': goal.description,
                'block': goal.block,
                'quarter': goal.quarter,
                'weight': goal.weight,
                'planned': goal.planned,
                'current': goal.current,
                'current_result': goal.current_result,
                'mark': goal.mark,
                'fact_mark': goal.fact_mark,
                'isdone': goal.isdone}

    translator = {'name': 'Название',
                  'description': 'Образ результата',
                  'block': 'Блок',
                  'quarter': 'Квартал',
                  'weight': 'Вес',
                  'planned': 'Запланированная',
                  'current': 'Утверждённая',
                  'current_result': 'Текущий результат',
                  'mark': 'Оценка сотрудника',
                  'fact_mark': 'Оценка руководителя',
                  'isdone': 'Выполнено'}

    if request.user == goal.owner_id and not request.user.is_superuser:
        new_data['fact_mark'] = old_data['fact_mark']
        new_data['current'] = old_data['current']

    is_change = False
    for i in new_data:
        if old_data[i] != new_data[i]:
            is_change = True
            break
    if not is_change:
        return

    history = History(goal=goal, owner_id=request.user)
    goal.history_set.add(history, bulk=False)

    for i in new_data:
        if old_data[i] != new_data[i]:
            if i == 'planned':
                print(old_data[i], new_data[i])
                old_data[i] = 'Запланированная' \
                    if old_data[i] else 'Незапланированная'
                new_data[i] = 'Запланированная' \
                    if new_data[i] else 'Незапланированная'
            if i in ['current', 'isdone']:
                old_data[i] = 'Да' if old_data[i] else 'Нет'
                new_data[i] = 'Да' if new_data[i] else 'Нет'
            if i in ['mark', 'weight', 'fact_mark']:
                old_data[i] = str(old_data[i]) + '%'
                new_data[i] = str(new_data[i]) + '%'
            history.fieldchange_set.create(field=translator[i],
                                           old_data=old_data[i],
                                           new_data=new_data[i])

    send_notification(request, goal, True)
    goal.save()


def send_notification(request, goal, is_goal):
    users_to_send = []
    if goal.owner_id == request.user:
        if request.user.is_superuser:
            return
        users = User.objects.filter(groups__in=request.user.groups.all())
        for user in users:
            if user.has_perm('browse.change_goal'):
                user2 = user
                if user == request.user:
                    user2 = User.objects.get(is_superuser=True)
                users_to_send.append(user2)
    if len(users_to_send) == 0:
        users_to_send.append(goal.owner_id)
    for user in users_to_send:
        notifi = Notification(is_goal=is_goal,
                              user=user,
                              goal=goal,
                              is_read=False)
        if not Notification.objects.filter(goal=goal,
                                           is_read=False,
                                           is_goal=is_goal,
                                           user=user).exists():
            notifi.save()


def edit_goal(request, goal):
    update_history(goal, request)
    goal.name = request.POST.get('name')
    goal.description = request.POST.get('description')
    goal.block = request.POST.get('block')
    goal.quarter = request.POST.get('quarter')
    goal.weight = int(request.POST.get('weight'))
    goal.planned = true_converter[request.POST.get('planned')]
    goal.current_result = request.POST.get('current_result')
    goal.mark = int(request.POST.get('mark'))
    goal.isdone = true_converter[request.POST.get('is_done')]
    if not request.user == goal.owner_id or request.user.is_superuser:
        goal.current = true_converter[request.POST.get('current')]
        goal.fact_mark = int(request.POST.get('fact_mark'))
    goal.save(update_fields=['name',
                             'description',
                             'block',
                             'quarter',
                             'weight',
                             'planned',
                             'current',
                             'current_result',
                             'mark',
                             'fact_mark'])


def send_message(request, goal):
    text = request.POST.get('message')
    for chunk in split_text(text, 2000):
        if len(chunk) > 0:
            goal.chat_set.create(owner_id=request.user, message=chunk)
    goal.save()

    send_notification(request, goal, False)
