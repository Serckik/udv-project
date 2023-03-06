from django.db import models
from django.core.exceptions import ValidationError

def validate_interval(value):
    if value < 0.0 or value > 100.0:
        raise ValidationError(('%(value)s должен быть в диапазоне: [0.0, 100.0]'), params={'value': value},)

class Goal(models.Model):
    owner_id = models.IntegerField('ID Ответственного', null=False)
    name = models.TextField('Название цели', null=False)
    description = models.TextField('Образ результата', null=False)
    block = models.CharField('Блок', choices=[('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'),
     ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'),
     ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и з/п', 'Кадровый учет и з/п'),
     ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'),
    ('Оценка', 'Оценка')], null=False, max_length=30)
    quarter = models.PositiveSmallIntegerField('Квартал', choices=[(1, 1), (2, 2), (3, 3), (4, 4)], null=False)
    weight = models.FloatField('Вес', validators=[validate_interval], null=False)
    current_level = models.IntegerField('Утверждённая', null=True)
    planned = models.BooleanField('Запланированная', null=False)
    chat = models.JSONField('Чат', null=True)
    history = models.JSONField('История', null=True)
    #percent_of_completion = models.FloatField('Процент выполнения', validators=[validate_interval], null=True)
    
    class Meta:
        verbose_name = 'Цель'
        verbose_name_plural = 'Цели'