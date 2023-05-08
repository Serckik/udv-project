from django.core.exceptions import ValidationError


def validate_image_extension(value):
    import os
    ext = os.path.splitext(value.name)[1] 
    valid_extensions = ['.png', '.jpg', '.jpeg']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Формат файла не поддерживается')


def file_size(value):
    limit = 10 * 1024 * 1024
    if value.size > limit:
        raise ValidationError('Файл слишком большой. Максимальный вес: 10 МБ')