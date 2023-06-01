from django.contrib import admin
from .models import HydroApp, HydroLink

# Register your models here.
admin.site.register(HydroApp)
admin.site.register(HydroLink)