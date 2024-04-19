from django.contrib import admin
from .models import App

# Register your models here.
class AppAdmin(admin.ModelAdmin):
    list_display=['name', "description"]
    search_fields=['name', "description"]

admin.site.register(App, AppAdmin)