# Generated by Django 4.1.7 on 2023-04-02 10:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0019_quarters_alter_goal_quarter'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Quarters',
            new_name='Quarter',
        ),
        migrations.AlterModelOptions(
            name='quarter',
            options={'verbose_name': 'Квартал', 'verbose_name_plural': 'Кварталы'},
        ),
    ]