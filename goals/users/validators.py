from django.core.exceptions import ValidationError


def validate_image_extension(value):
    if value not in ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']:
        raise ValidationError('Расширение файла не поддерживается. \
                               Поддерживаемые форматы: PNG, JPG')


def file_size(value):
    limit = 2 * 1024 * 1024
    if len(value) * 3/4 / 1024 / 1024 > limit:
        raise ValidationError('Файл слишком большой. Максимальный вес: 2 МБ')
