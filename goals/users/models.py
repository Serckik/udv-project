from django.db import models
from django.contrib.auth.models import User
from browse.models import Goal
from django.utils.timezone import localtime
from django.utils import timezone
import os


class Notification(models.Model):
    is_read = models.BooleanField('Прочитано', default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_goal = models.BooleanField('Задача', default=False)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)

    def is_active(self):
        """
            Проверяет, прошел ли месяц с момента создания объекта
        """
        now = localtime(timezone.now())
        delta = now - localtime(self.created_at)
        return delta.days <= 30

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'


class Image(models.Model):

    def wrapper(instance, filename):
        path = "users/static/users/img/"
        ext = filename.split('.')[-1]
        format = str(instance.user.id) + '.' + ext
        return os.path.join(path, format)

    image = models.ImageField('Аватар', upload_to=wrapper,
                              null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Аватарка'
        verbose_name_plural = 'Аватарки'
