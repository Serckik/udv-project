# Generated by Django 4.1.7 on 2023-03-24 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='notification',
            options={'verbose_name': 'Уведомление', 'verbose_name_plural': 'Уведомления'},
        ),
        migrations.AddField(
            model_name='notification',
            name='field',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='is_goal',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='notification',
            name='new_data',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='old_data',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='notification',
            name='message',
            field=models.TextField(null=True),
        ),
    ]
