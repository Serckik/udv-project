# Generated by Django 4.1.7 on 2023-03-16 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0011_remove_goal_current_level_goal_current_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='current',
            field=models.PositiveSmallIntegerField(choices=[(True, 'Да'), (False, 'Нет')], null=True, verbose_name='Утверждённая'),
        ),
        migrations.AlterField(
            model_name='goal',
            name='planned',
            field=models.PositiveSmallIntegerField(choices=[(True, 'Да'), (False, 'Нет')], null=True, verbose_name='Запланированная'),
        ),
    ]