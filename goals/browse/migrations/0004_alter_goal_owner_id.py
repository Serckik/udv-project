# Generated by Django 4.1.7 on 2023-02-21 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0003_remove_goal_owner_goal_owner_id_alter_goal_quarter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='owner_id',
            field=models.IntegerField(max_length=3, null=True, verbose_name='ID Ответственного'),
        ),
    ]
