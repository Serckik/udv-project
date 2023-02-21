# Generated by Django 4.1.7 on 2023-02-21 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0002_alter_goal_owner_alter_goal_weight'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='goal',
            name='owner',
        ),
        migrations.AddField(
            model_name='goal',
            name='owner_id',
            field=models.CharField(max_length=3, null=True, verbose_name='ID Ответственного'),
        ),
        migrations.AlterField(
            model_name='goal',
            name='quarter',
            field=models.PositiveSmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4)], verbose_name='Квартал'),
        ),
    ]
