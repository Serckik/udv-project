# Generated by Django 4.1.7 on 2023-04-30 10:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_remove_notification_field_change'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='message',
        ),
    ]