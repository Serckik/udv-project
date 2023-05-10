# Generated by Django 4.1.5 on 2023-05-09 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0027_alter_goal_block_alter_goal_current_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='quarter',
            field=models.CharField(choices=[('', ''), ('1 квартал 2022', '1 квартал 2022'), ('2 квартал 2022', '2 квартал 2022'), ('3 квартал 2022', '3 квартал 2022'), ('4 квартал 2022', '4 квартал 2022'), ('1 квартал 2023', '1 квартал 2023'), ('2 квартал 2023', '2 квартал 2023'), ('3 квартал 2023', '3 квартал 2023'), ('4 квартал 2023', '4 квартал 2023')], max_length=25, verbose_name='Квартал'),
        ),
    ]
