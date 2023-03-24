from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
    is_read = models.BooleanField(default=False)
    message = models.TextField(null=True)
    old_data = models.TextField(null=True)
    new_data = models.TextField(null=True)
    field = models.TextField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_goal = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'
