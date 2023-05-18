from django import forms
from .models import CHOICES_WEIGHT, CHOICES_MARK, \
    CHOICES_BLOCK, CHOICES_BOOL, choices_quarter


class GoalForm(forms.Form):
    name = forms.CharField(label='Название задачи', widget=forms.Textarea(),
                           required=True)
    description = forms.CharField(label='Образ результата',
                                  widget=forms.Textarea(), required=False)
    current_result = forms.CharField(label='Текущий результат',
                                     widget=forms.Textarea(), required=False)
    block = forms.ChoiceField(label='Блок', choices=CHOICES_BLOCK,
                              required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=choices_quarter,
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
    quarter = forms.ChoiceField(label='Квартал', choices=choices_quarter,
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
    plan = forms.CharField(label='План', required=False)
    fact = forms.CharField(label='Факт', required=False)
    block = forms.ChoiceField(label='Блок',
                              choices=CHOICES_BLOCK, required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=choices_quarter,
                                required=True)
    average_mark = forms.ChoiceField(label='Степень завершенности',
                                     required=False,
                                     choices=CHOICES_MARK)


class EditSummaryForm(forms.Form):
    name = forms.CharField(label='name', required=True)
    plan = forms.CharField(label='План', required=False)
    fact = forms.CharField(label='Факт', required=False)
    average_mark = forms.ChoiceField(label='Степень завершенности',
                                     required=False,
                                     choices=CHOICES_MARK)
