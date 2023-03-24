from django.db import models
from django.contrib.auth.models import User

CHOICES_WEIGHT = [('', '')] + [(i,i) for i in range(101)] # вес
CHOICES_MARK = [('', '')] + [(i,i) for i in range(201)] # оценка

class Goal(models.Model):
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField('Название цели', null=False)
    description = models.TextField('Образ результата', null=False)
    block = models.CharField('Блок', choices=[('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'),
     ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'),
     ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и з/п', 'Кадровый учет и з/п'),
     ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'),
    ('Оценка', 'Оценка')], null=False, max_length=30)
    quarter = models.PositiveSmallIntegerField('Квартал', choices=[(1, 1), (2, 2), (3, 3), (4, 4)], null=False)
    weight = models.FloatField('Вес', choices=CHOICES_WEIGHT, null=False)
    current = models.BooleanField('Утверждённая', choices=[(True, 'Да'), (False, 'Нет')], null=True)
    planned = models.BooleanField('Запланированная', choices=[(True, 'Да'), (False, 'Нет')], null=True)
    chat = models.JSONField('Чат', null=True)
    history = models.JSONField('История', null=True)
    current_result = models.TextField('Текущий результат', null=True)
    mark = models.IntegerField('Оценка сотрудника', choices=CHOICES_MARK, null=True)
    fact_mark = models.IntegerField('Оценка руководителя', choices=CHOICES_MARK, null=True)
    
    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'