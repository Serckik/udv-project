# Generated by Django 4.1.7 on 2023-05-22 08:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Goal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(verbose_name='Название цели')),
                ('description', models.TextField(verbose_name='Образ результата')),
                ('block', models.CharField(choices=[('', ''), ('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'), ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'), ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и зп', 'Кадровый учет и зп'), ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'), ('Оценка', 'Оценка')], max_length=30, verbose_name='Блок')),
                ('quarter', models.CharField(max_length=25, verbose_name='Квартал')),
                ('weight', models.IntegerField(choices=[('', ''), (0, 0), (5, 5), (10, 10), (15, 15), (20, 20), (25, 25), (30, 30), (35, 35), (40, 40), (45, 45), (50, 50), (55, 55), (60, 60), (65, 65), (70, 70), (75, 75), (80, 80), (85, 85), (90, 90), (95, 95), (100, 100), (105, 105), (110, 110), (115, 115), (120, 120), (125, 125), (130, 130), (135, 135), (140, 140), (145, 145), (150, 150), (155, 155), (160, 160), (165, 165), (170, 170), (175, 175), (180, 180), (185, 185), (190, 190), (195, 195), (200, 200)], verbose_name='Вес')),
                ('current', models.BooleanField(choices=[('', ''), (True, 'Да'), (False, 'Нет')], null=True, verbose_name='Утверждённая')),
                ('planned', models.BooleanField(choices=[('', ''), (True, 'Да'), (False, 'Нет')], null=True, verbose_name='Запланированная')),
                ('current_result', models.TextField(null=True, verbose_name='Текущий результат')),
                ('mark', models.IntegerField(choices=[('', ''), (0, 0), (5, 5), (10, 10), (15, 15), (20, 20), (25, 25), (30, 30), (35, 35), (40, 40), (45, 45), (50, 50), (55, 55), (60, 60), (65, 65), (70, 70), (75, 75), (80, 80), (85, 85), (90, 90), (95, 95), (100, 100), (105, 105), (110, 110), (115, 115), (120, 120), (125, 125), (130, 130), (135, 135), (140, 140), (145, 145), (150, 150), (155, 155), (160, 160), (165, 165), (170, 170), (175, 175), (180, 180), (185, 185), (190, 190), (195, 195), (200, 200)], null=True, verbose_name='Оценка сотрудника')),
                ('fact_mark', models.IntegerField(choices=[('', ''), (0, 0), (5, 5), (10, 10), (15, 15), (20, 20), (25, 25), (30, 30), (35, 35), (40, 40), (45, 45), (50, 50), (55, 55), (60, 60), (65, 65), (70, 70), (75, 75), (80, 80), (85, 85), (90, 90), (95, 95), (100, 100), (105, 105), (110, 110), (115, 115), (120, 120), (125, 125), (130, 130), (135, 135), (140, 140), (145, 145), (150, 150), (155, 155), (160, 160), (165, 165), (170, 170), (175, 175), (180, 180), (185, 185), (190, 190), (195, 195), (200, 200)], null=True, verbose_name='Оценка руководителя')),
                ('isdone', models.BooleanField(choices=[('', ''), (True, 'Да'), (False, 'Нет')], verbose_name='Выполнена')),
                ('summaries_count', models.IntegerField(default=0, verbose_name='В сколько сводок входит?')),
                ('owner_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Задача',
                'verbose_name_plural': 'Задачи',
            },
        ),
        migrations.CreateModel(
            name='Quarter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quarter', models.CharField(max_length=25, verbose_name='Квартал')),
            ],
            options={
                'verbose_name': 'Квартал',
                'verbose_name_plural': 'Кварталы',
            },
        ),
        migrations.CreateModel(
            name='Summary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(verbose_name='Название')),
                ('plan', models.TextField(default='', null=True, verbose_name='План')),
                ('fact', models.TextField(default='', null=True, verbose_name='Факт')),
                ('block', models.CharField(choices=[('', ''), ('Подбор', 'Подбор'), ('Адаптация', 'Адаптация'), ('Развитие персонала', 'Развитие персонала'), ('HR-сопровождение', 'HR-сопровождение'), ('Корп. культура и бенефиты', 'Корп. культура и бенефиты'), ('Кадровый учет и зп', 'Кадровый учет и зп'), ('HR-бренд внешний', 'HR-бренд внешний'), ('Внутренняя работа отдела', 'Внутренняя работа отдела'), ('Оценка', 'Оценка')], max_length=30, verbose_name='Блок')),
                ('quarter', models.CharField(max_length=25, verbose_name='Квартал')),
                ('average_mark', models.IntegerField(choices=[('', ''), (0, 0), (5, 5), (10, 10), (15, 15), (20, 20), (25, 25), (30, 30), (35, 35), (40, 40), (45, 45), (50, 50), (55, 55), (60, 60), (65, 65), (70, 70), (75, 75), (80, 80), (85, 85), (90, 90), (95, 95), (100, 100), (105, 105), (110, 110), (115, 115), (120, 120), (125, 125), (130, 130), (135, 135), (140, 140), (145, 145), (150, 150), (155, 155), (160, 160), (165, 165), (170, 170), (175, 175), (180, 180), (185, 185), (190, 190), (195, 195), (200, 200)], default=0, null=True, verbose_name='Степень завершенности')),
                ('goals', models.ManyToManyField(to='browse.goal')),
            ],
            options={
                'verbose_name': 'Сводка',
                'verbose_name_plural': 'Сводки',
            },
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='browse.goal')),
                ('owner_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'История',
                'verbose_name_plural': 'Истории',
            },
        ),
        migrations.CreateModel(
            name='FieldChange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field', models.TextField(verbose_name='Поле')),
                ('old_data', models.TextField(verbose_name='Было')),
                ('new_data', models.TextField(verbose_name='Стало')),
                ('history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='browse.history')),
            ],
            options={
                'verbose_name': 'Поле (история)',
                'verbose_name_plural': 'Поля (история)',
            },
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(verbose_name='Сообщение')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='browse.goal')),
                ('owner_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Чат',
                'verbose_name_plural': 'Чаты',
            },
        ),
    ]
