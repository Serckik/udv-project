from django.contrib.auth.models import Group


def create_groups():
    GROUPS = ['HR интегратора и производства',
              'HR разработки',
              'Направление компенсации и льготы',
              'Направление обучения']
    for group in GROUPS:
        Group.objects.get_or_create(name=group)
