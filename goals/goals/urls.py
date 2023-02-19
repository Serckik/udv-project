from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',  include('browse.urls')),
    path('add/', include('add.urls')),
    path('profile/',  include('django.contrib.auth.urls')),
    path('summary/', include('summary.urls'))
]
