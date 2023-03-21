from django import forms
from .models import CHOICES_WEIGHT

class AddGoalForm(forms.Form):
    name = forms.CharField(label='Название задачи', widget=forms.Textarea(), required=True)
    description = forms.CharField(label='Образ результата', widget=forms.Textarea())
    block = forms.ChoiceField(label='Блок', choices=[('', ''), ('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'),
     ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'),
     ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и з/п', 'Кадровый учет и з/п'),
     ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'),
    ('Оценка', 'Оценка')], required=True)
    quarter = forms.ChoiceField(label='Квартал', choices=[('', ''), (1, 1), (2, 2), (3, 3), (4, 4)], required=True)
    planned = forms.ChoiceField(label='Запланированная', choices=[('', ''), (True, 'Да'), (False, 'Нет')], required=True)
    weight = forms.ChoiceField(label='Вес', required=True, choices=CHOICES_WEIGHT)
