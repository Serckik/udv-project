# Generated by Django 4.1.7 on 2023-06-05 09:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('browse', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_read', models.BooleanField(default=False, verbose_name='Прочитано')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_goal', models.BooleanField(default=False, verbose_name='Задача')),
                ('goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='browse.goal')),
                ('sended_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sended_by', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Уведомление',
                'verbose_name_plural': 'Уведомления',
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='users/static/users/img/', verbose_name='Аватар')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Аватарка',
                'verbose_name_plural': 'Аватарки',
            },
        ),
    ]
