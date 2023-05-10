from django.contrib import admin
from .models import Goal, Chat, History, FieldChange, Quarter


admin.site.register(Goal)
admin.site.register(Chat)
admin.site.register(History)
admin.site.register(FieldChange)
admin.site.register(Quarter)
