from django.contrib import admin
# from .models import ExtendedUser
from django.contrib.auth.admin import UserAdmin
from .models import Account

# Register your models here.
class UserAdminConfig(UserAdmin):
    list_display=['email','username','first_name', "last_name", "date_joined"]
    search_fields=['email','username']
    readonly_fields=['date_joined','last_login', "db_password"]
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username','first_name','last_name', "personal_introduction", "confirmed_data_policy")}),
        ('Activity', {'fields': ('date_joined','last_login')}),
        ('WeatherDB', {'fields': ("wdb_is_db_user", 'wdb_max_downloads', 'db_password')}),
        ('Permissions', {'fields': ('is_email_confirmed', "is_staff", 'is_superuser', 'is_active', 'is_tester')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','first_name', 'password1', 'password2'),
        }),
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_tester', 'wdb_is_db_user')

admin.site.register(Account,UserAdminConfig)