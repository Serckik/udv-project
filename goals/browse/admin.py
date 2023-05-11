from django.contrib import admin
from .models import Goal, Chat, History, FieldChange, Quarter, Summary


admin.site.register(Goal)
admin.site.register(Chat)
admin.site.register(History)
admin.site.register(FieldChange)
admin.site.register(Quarter)
admin.site.register(Summary)
