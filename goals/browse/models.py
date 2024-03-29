from django.db import models
from django.contrib.auth.models import User

CHOICES_WEIGHT = [('', '')] + [(i, i)
                               for i in range(0, 121, 5)]  # вес
CHOICES_MARK = [('', '')] + [(i, i)
                             for i in range(0, 121, 5)]  # оценка
CHOICES_BLOCK = [
    ('', ''),
    ('Подбор', 'Подбор'),
    ('Адаптация', 'Адаптация'),
    ('Развитие персонала', 'Развитие персонала'),
    ('HR-сопровождение', 'HR-сопровождение'),
    ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'),
    ('Кадровый учет и зп', 'Кадровый учет и зп'),
    ('HR-бренд внешний', 'HR-бренд внешний'),
    ('Внутренняя работа отдела', 'Внутренняя работа отдела'),
    ('Оценка', 'Оценка')
]
CHOICES_BOOL = [('', ''), (True, 'Да'), (False, 'Нет')]


class Quarter(models.Model):
    quarter = models.CharField('Квартал', max_length=25)

    class Meta:
        verbose_name = 'Квартал'
        verbose_name_plural = 'Кварталы'


def choices_quarter():
    try:
        choices = [('', '')] + [(i.quarter, i.quarter)
                                for i in Quarter.objects.all()]
    except:
        choices = [('', '')]
    return choices


class Goal(models.Model):
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField('Название цели', null=False)
    description = models.TextField('Образ результата', null=False)
    block = models.CharField('Блок', choices=CHOICES_BLOCK, null=False,
                             max_length=30)
    quarter = models.CharField('Квартал', null=False,
                               max_length=25)
    weight = models.IntegerField('Вес', choices=CHOICES_WEIGHT, null=False)
    current = models.BooleanField('Утверждённая', choices=CHOICES_BOOL,
                                  null=True)
    planned = models.BooleanField('Запланированная', choices=CHOICES_BOOL,
                                  null=True)
    current_result = models.TextField('Текущий результат', null=True)
    mark = models.IntegerField('Оценка сотрудника', choices=CHOICES_MARK,
                               null=True)
    fact_mark = models.IntegerField('Оценка руководителя',
                                    choices=CHOICES_MARK, null=True)
    isdone = models.BooleanField('Выполнена', choices=CHOICES_BOOL)
    summaries_count = models.IntegerField('В сколько сводок входит?',
                                          default=0)

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'


class Chat(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField('Сообщение')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'


class History(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'История'
        verbose_name_plural = 'Истории'


class FieldChange(models.Model):
    history = models.ForeignKey(History, on_delete=models.CASCADE)
    field = models.TextField('Поле')
    old_data = models.TextField('Было')
    new_data = models.TextField('Стало')

    class Meta:
        verbose_name = 'Поле (история)'
        verbose_name_plural = 'Поля (история)'


class Summary(models.Model):
    name = models.TextField('Название')
    goals = models.ManyToManyField(Goal)
    plan = models.TextField('План', null=True, default='')
    fact = models.TextField('Факт', null=True, default='')
    block = models.CharField('Блок', choices=CHOICES_BLOCK, null=False,
                             max_length=30)
    quarter = models.CharField('Квартал', null=False,
                               max_length=25)
    average_mark = models.IntegerField('Степень завершенности',
                                       choices=CHOICES_MARK, null=True,
                                       default=0)

    class Meta:
        verbose_name = 'Сводка'
        verbose_name_plural = 'Сводки'
