from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Profile

# This makes Profile manageable from /admin/ = Django admin backend
admin.site.register(Profile)