from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',  include('browse.urls')),
    path('add/', include('add.urls')),
    path('login/', include('login.urls')),
    path('summary/', include('summary.urls'))
]
