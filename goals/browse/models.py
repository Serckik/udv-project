from django.db import models
from django.contrib.auth.models import User

CHOICES_WEIGHT = [('', '')] + [(i, i) for i in range(101)] # вес
CHOICES_MARK = [('', '')] + [(i, i) for i in range(0, 201, 5)] # оценка


class Quarter(models.Model):
    quarter = models.CharField('Квартал', max_length=25)

    class Meta:
        verbose_name = 'Квартал'
        verbose_name_plural = 'Кварталы'
    

CHOICES_QUARTER = [('', '')] + [(i.quarter, i.quarter) for i in Quarter.objects.all()]

class Goal(models.Model):
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField('Название цели', null=False)
    description = models.TextField('Образ результата', null=False)
    block = models.CharField('Блок', choices=[('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'),
     ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'),
     ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и з/п', 'Кадровый учет и з/п'),
     ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'),
    ('Оценка', 'Оценка')], null=False, max_length=30)
    quarter = models.CharField('Квартал', choices=CHOICES_QUARTER, null=False, max_length=25)
    weight = models.IntegerField('Вес', choices=CHOICES_WEIGHT, null=False)
    current = models.BooleanField('Утверждённая', choices=[(True, 'Да'), (False, 'Нет')], null=True)
    planned = models.BooleanField('Запланированная', choices=[(True, 'Да'), (False, 'Нет')], null=True)
    current_result = models.TextField('Текущий результат', null=True)
    mark = models.IntegerField('Оценка сотрудника', choices=CHOICES_MARK, null=True)
    fact_mark = models.IntegerField('Оценка руководителя', choices=CHOICES_MARK, null=True)
    isdone = models.BooleanField('Выполнена', choices=[(True, 'Да'), (False, 'Нет')])
    
    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'

class Chat(models.Model):
    goal = models.ForeignKey(Goal, on_delete = models.CASCADE)
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField('Сообщение')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'

class History(models.Model):
    goal = models.ForeignKey(Goal, on_delete = models.CASCADE)
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'История'
        verbose_name_plural = 'Истории'

class FieldChange(models.Model):
    history = models.ForeignKey(History, on_delete = models.CASCADE)
    field = models.TextField('Поле')
    old_data = models.TextField('Было')
    new_data = models.TextField('Стало')

    class Meta:
        verbose_name = 'Поле (история)'
        verbose_name_plural = 'Поля (история)'
