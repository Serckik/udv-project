# Generated by Django 4.1.7 on 2023-05-11 17:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0029_alter_goal_quarter_summary'),
    ]

    operations = [
        migrations.AddField(
            model_name='summary',
            name='name',
            field=models.TextField(default=1, verbose_name='Название'),
            preserve_default=False,
        ),
    ]
