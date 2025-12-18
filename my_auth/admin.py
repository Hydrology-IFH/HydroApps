from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group as DjangoGroup
from .models import Account, Permission, PermissionClass, TokenPermission

# Register your models here.
@admin.register(Account)
class UserAdminConfig(UserAdmin):
    list_display=['email', 'username', 'first_name', "last_name", "date_joined", "last_login"]
    search_fields=['email', 'username']
    readonly_fields=['date_joined', 'last_login', "db_password", "expiration_notification"]
    fieldsets = (
        ("Login", {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', "personal_introduction", "confirmed_data_policy")
        }),
        ('Activity', {
            'classes': ('wide',),
            'fields': ('date_joined', 'last_login', 'expiration_notification')
        }),
        ('WeatherDB', {
            'classes': ('wide',),
            'fields': ("wdb_is_db_user", 'wdb_max_downloads', 'db_password')
        }),
        ('Permissions', {
            'classes': ('wide',),
            'fields': ('is_email_confirmed', "is_staff", 'is_superuser', 'is_active', 'permissions')
        }),
    )
    add_fieldsets = (
        ("Login", {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
        ('Personal info', {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', "personal_introduction", "confirmed_data_policy")
        }),
        ('WeatherDB', {
            'classes': ('wide',),
            'fields': ("wdb_is_db_user", 'wdb_max_downloads')
        }),
        ('Permissions', {
            'classes': ('wide',),
            'fields': ('is_email_confirmed', 'is_active', 'permissions')
        }),
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'wdb_is_db_user')

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display=["app", 'permission_class']
    search_fields=["app", 'permission_class']

@admin.register(PermissionClass)
class PermissionClassAdmin(admin.ModelAdmin):
    list_display=['name', "description"]
    search_fields=['name', "description"]

@admin.register(TokenPermission)
class TokenPermissionAdmin(admin.ModelAdmin):
    list_display=['description', "valid_until", 'token', "token_url"]
    search_fields=['description', 'token']
    readonly_fields=["token", "token_url"]

    def token_url(self, obj):
        return format_html("<a href='{0}' target='blank'>{0}</a> <br><span style='color: #888; font-size: 0.8em;'>The link to share the token with others. You can also add the token to a specific App-URL as a parameter.</span>", obj.token_url)
    token_url.short_description = "Sharing link"

# Unregister the Group model from admin.
admin.site.unregister(DjangoGroup)