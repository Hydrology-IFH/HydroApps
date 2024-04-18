from django.contrib import admin
# from .models import ExtendedUser
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group as DjangoGroup
from .models import Account, Permission, PermissionClass, TokenPermission

# Register your models here.
class UserAdminConfig(UserAdmin):
    list_display=['email', 'username', 'first_name', "last_name", "date_joined", "last_login"]
    search_fields=['email', 'username']
    readonly_fields=['date_joined', 'last_login', "db_password", "expiration_notification"]
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'last_name', "personal_introduction", "confirmed_data_policy")}),
        ('Activity', {'fields': ('date_joined', 'last_login', 'expiration_notification')}),
        ('WeatherDB', {'fields': ("wdb_is_db_user", 'wdb_max_downloads', 'db_password')}),
        ('Permissions', {'fields': ('is_email_confirmed', "is_staff", 'is_superuser', 'is_active', 'permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'password1', 'password2'),
        }),
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'wdb_is_db_user')

class PermissionAdmin(admin.ModelAdmin):
    list_display=["app", 'permission_class']
    search_fields=["app", 'permission_class']

class PermissionClassAdmin(admin.ModelAdmin):
    list_display=['name', "description"]
    search_fields=['name', "description"]

class TokenPermissionAdmin(admin.ModelAdmin):
    list_display=['description', 'token', 'permissions']
    search_fields=['description', 'token', 'permissions']

admin.site.register(Account, UserAdminConfig)
admin.site.register(Permission, PermissionAdmin)
admin.site.register(PermissionClass, PermissionClassAdmin)
admin.site.register(TokenPermission, TokenPermissionAdmin)
admin.site.unregister(DjangoGroup)