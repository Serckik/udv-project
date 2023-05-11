from django import forms
from .models import CHOICES_WEIGHT, CHOICES_MARK, CHOICES_QUARTER, \
    CHOICES_BLOCK, CHOICES_BOOL, Goal


class GoalForm(forms.Form):
    name = forms.CharField(label='Название задачи', widget=forms.Textarea(),
                           required=True)
    description = forms.CharField(label='Образ результата',
                                  widget=forms.Textarea(), required=False)
    current_result = forms.CharField(label='Текущий результат',
                                     widget=forms.Textarea(), required=False)
    block = forms.ChoiceField(label='Блок', choices=CHOICES_BLOCK,
                              required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=CHOICES_QUARTER,
                                required=True)
    current = forms.ChoiceField(label='Утверждённая', choices=CHOICES_BOOL,
                                required=True)
    planned = forms.ChoiceField(label='Запланированная', choices=CHOICES_BOOL,
                                required=True)
    weight = forms.ChoiceField(label='Вес', required=True,
                               choices=CHOICES_WEIGHT)
    mark = forms.ChoiceField(label='Оценка сотрудника', required=True,
                             choices=CHOICES_MARK)
    fact_mark = forms.ChoiceField(label='Оценка руководителя', required=True,
                                  choices=CHOICES_MARK)


class ChatForm(forms.Form):
    message = forms.CharField(label='Написать сообщение',
                              widget=forms.Textarea())


class AddGoalForm(forms.Form):
    name = forms.CharField(label='Название задачи', widget=forms.Textarea(),
                           required=True)
    description = forms.CharField(label='Образ результата',
                                  widget=forms.Textarea(), required=False)
    block = forms.ChoiceField(label='Блок',
                              choices=CHOICES_BLOCK, required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=CHOICES_QUARTER,
                                required=True)
    planned = forms.ChoiceField(label='Запланированная',
                                choices=[('', ''),
                                         (True, 'Да'),
                                         (False, 'Нет')],
                                required=True)
    weight = forms.ChoiceField(label='Вес', required=True,
                               choices=CHOICES_WEIGHT)


class SummaryForm(forms.Form):
    name = forms.CharField(label='name', required=True)
    plan = forms.CharField(label='План', required=True)
    fact = forms.CharField(label='Факт', required=True)
    block = forms.ChoiceField(label='Блок',
                              choices=CHOICES_BLOCK, required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=CHOICES_QUARTER,
                                required=True)
