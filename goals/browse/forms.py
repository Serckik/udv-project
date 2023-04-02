from django import forms
from .models import CHOICES_WEIGHT, CHOICES_MARK, CHOICES_QUARTER   

class GoalForm(forms.Form):
    name = forms.CharField(label='Название задачи', widget=forms.Textarea(), required=True)
    description = forms.CharField(label='Образ результата', widget=forms.Textarea())
    current_result = forms.CharField(label='Текущий результат', widget=forms.Textarea(), required=False)
    block = forms.ChoiceField(label='Блок', choices=[('', ''), ('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'),
     ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'),
     ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и з/п', 'Кадровый учет и з/п'),
     ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'),
    ('Оценка', 'Оценка')], required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=CHOICES_QUARTER, required=True)
    current = forms.ChoiceField(label='Утверждённая', choices=[('', ''), (True, 'Да'), (False, 'Нет')], required=True)
    planned = forms.ChoiceField(label='Запланированная', choices=[('', ''), (True, 'Да'), (False, 'Нет')], required=True)
    weight = forms.ChoiceField(label='Вес', required=True, choices=CHOICES_WEIGHT)
    mark = forms.ChoiceField(label='Оценка сотрудника', required=True, choices=CHOICES_MARK)
    fact_mark = forms.ChoiceField(label='Оценка руководителя', required=True, choices=CHOICES_MARK)


class ChatForm(forms.Form):
    message = forms.CharField(label='Написать сообщение', widget=forms.Textarea()) 


class AddGoalForm(forms.Form):
    name = forms.CharField(label='Название задачи', widget=forms.Textarea(), required=True)
    description = forms.CharField(label='Образ результата', widget=forms.Textarea())
    block = forms.ChoiceField(label='Блок', choices=[('', ''), ('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'),
     ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'),
     ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и з/п', 'Кадровый учет и з/п'),
     ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'),
    ('Оценка', 'Оценка')], required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=CHOICES_QUARTER, required=True)
    planned = forms.ChoiceField(label='Запланированная', choices=[('', ''), (True, 'Да'), (False, 'Нет')], required=True)
    weight = forms.ChoiceField(label='Вес', required=True, choices=CHOICES_WEIGHT)
