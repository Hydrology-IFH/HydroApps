from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.db import connections
from django.db.models.signals import post_save, post_init
from django.dispatch import receiver
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
from sqlalchemy import text
from HydroApps.models import App
import secrets

from weatherDB.lib.connections import DB_ENG as wdb_engine

from .token import account_activation_token

# Create your models here.
class AccountManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, password, **other_fields):
        if not email:
            raise ValueError(_("Users must have an email address"))
        if not username:
            raise ValueError(_("Users must have an unique username"))
        # check against database users
        with connections["weatherdb"].cursor() as cursor:
            cursor.execute("""
                SELECT groname AS username
                FROM pg_catalog.pg_group pg
                UNION (SELECT usename FROM pg_catalog.pg_user);""")
            db_users = [row[0] for row in cursor.fetchall()]
        if username in db_users:
            raise ValueError(_("This username is already a database user for the weatherDB database."))
        email=self.normalize_email(email)
        user=self.model(email=email,username=username,first_name=first_name, last_name=last_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self,email,username,first_name,password,**other_fields):
        other_fields.setdefault('is_staff',True)
        other_fields.setdefault('is_superuser',True)
        other_fields.setdefault('is_active',True)
        other_fields.setdefault('wdb_is_db_user',True)
        if other_fields.get('is_staff') is not True:
            raise ValueError('is_staff is set to False')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('is_superuser is set to False')
        return self.create_user(email,username,first_name,password,**other_fields)


class PermissionClass(models.Model):
    name = models.CharField(max_length=100, primary_key=True, null=False, blank=False)
    description = models.TextField(max_length=300)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Permission class"
        verbose_name_plural = "Permission classes"

class Permission(models.Model):
    app = models.ForeignKey(App, blank=False, on_delete=models.CASCADE)
    permission_class = models.ForeignKey(PermissionClass, blank=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.app}: {self.permission_class}"

    class Meta:
        verbose_name = 'Permission'
        verbose_name_plural = 'Permissions'
        db_table_comment = "Possible Permissions for each app."
        unique_together = ('app', 'permission_class')

class Account(AbstractBaseUser, PermissionsMixin):
    email         = models.EmailField(_('email address'), max_length=60, unique=True)
    username      = models.CharField(max_length=60, unique=True)
    first_name    = models.CharField(max_length=30, blank=False)
    last_name     = models.CharField(max_length=30, blank=False)
    date_joined   = models.DateTimeField(verbose_name='date_joined', auto_now_add=True)
    last_login    = models.DateTimeField(verbose_name='last login', auto_now=True)
    personal_introduction = models.TextField(max_length=300, blank=False,
        help_text=_("Comment of the user why he/she should have access to the Hydro-Apps"))
    confirmed_data_policy = models.BooleanField(blank=False,
        verbose_name=_('I agree to the terms of usage of my data and I did read and agree to the policy agreement of this website.'),
        help_text=_('Designates whether the user confirmed the data policy agreement.'))
    is_email_confirmed=models.BooleanField(default=False,
        help_text=_('Designates whether the user confirmed it\'s e-mail address.'))
    is_active  = models.BooleanField(default=False,
        help_text=_('Designates whether the user got activated by a super user.'))
    is_staff = models.BooleanField(default=False,
        help_text=_('Designates whether the user can log into this admin site.')
    )
    is_superuser  = models.BooleanField(default=False,
        help_text=_('Designates whether the user is superuser.'))
    wdb_is_db_user = models.BooleanField(default=False,
        help_text=_('Designates whether the user can log into the WeatherDB-database.')
    )
    wdb_max_downloads = models.IntegerField(
        default=10, help_text=_('Designates the number of stations a user can download at once on the WeatherDB App.'))
    db_password = models.CharField(max_length=30, null=True, blank=True,
        help_text=_('The Password for this user to log into the database.'))
    expiration_notification = models.DateTimeField(
        default=None, null=True, blank=True,
        help_text=_('Designates the date and time when the user got noticed that his account will expire soon.'))
    permissions = models.ManyToManyField(
        Permission, blank=True, default=None,
        help_text=_('The permissions the user has.'))

    objects = AccountManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', "last_name"]

    def __str__(self):
        return self.username

    def renew_db_password(self):
        self.db_password = Account.objects.make_random_password(30)
        self.save()

    def remove(self, **kwargs):
        if self.is_active and self.wdb_is_db_user:
            with connections["weatherdb"].cursor() as cursor:
                cursor.execute(
                    f"DROP USER IF EXISTS \"{self.username}\";")

    @staticmethod
    def _get_domain(request=None):
        if request is None:
            return settings.BASE_DOMAIN
        else:
            return "https://" + get_current_site(request).domain

    @staticmethod
    def get_admin_emails():
        return list(*Account.objects.filter(is_superuser=True)\
                    .values_list("email", flat=False))

    def send_email_confirmation(self, request=None):
        message = render_to_string(
            'emails/confirm_email.html', {
                'user': self,
                'domain': self._get_domain(request),
                'uid': urlsafe_base64_encode(force_bytes(self.pk)),
                'token': account_activation_token.make_token(self)
        })
        email = EmailMessage(
            'Activate your Hydro-Apps account',
            message,
            to=[self.email]
        )
        email.send()

    def send_admin_confirm_user(self, request=None):
        message = render_to_string(
            'emails/confirm_user.html', {
                'user': self,
                'domain': self._get_domain(request),
                'uid': urlsafe_base64_encode(force_bytes(self.pk)),
                'token': account_activation_token.make_token(self)
        })
        email = EmailMessage(
            'Confirm an account for Hydro-Apps',
            message,
            to=self.get_admin_emails()
        )
        email.send()

    def send_activation_notice(self, request=None):
        message = render_to_string(
            'emails/account_activation_email.html', {
                'user': self,
                'domain': self._get_domain(request),
                'uid': urlsafe_base64_encode(force_bytes(self.pk)),
                'token': account_activation_token.make_token(self)
        })
        email = EmailMessage(
            'Hydro-Apps account got activated',
            message,
            to=[self.email]
        )
        email.send()

    def send_admin_request_db_access(self, request=None):
        message = render_to_string(
            'emails/request_db_access.html', {
                'user': self,
                'domain': self._get_domain(request),
                'uid': urlsafe_base64_encode(force_bytes(self.pk)),
                'token': account_activation_token.make_token(self)
        })
        email = EmailMessage(
            'Confirm a request for WeatherDB-access to database',
            message,
            to=self.get_admin_emails()
        )
        email.send()

    def send_account_expiration_notice(self):
        message = render_to_string(
            'emails/account_expiration_notice.html', {
                'user': self,
                'domain': self._get_domain(),
        })
        email = EmailMessage(
            'Your Hydro-Apps account will expire soon',
            message,
            to=[self.email]
        )
        email.send()

        # set flag that user got notified
        self.expiration_notification = timezone.now()
        self.save(update_fields=["expiration_notification"])

    @staticmethod
    def check_accounts(*args, **kwargs):
        login_limit_days = 365*2
        notice_limit_days = 30
        login_limit_dt = timezone.now() - timedelta(days=login_limit_days)
        notice_limit_dt = timezone.now() - timedelta(days=notice_limit_days)

        # remove accounts
        for account in Account.objects.filter(
                Q(last_login__lt=login_limit_dt) &
                (Q(expiration_notification__lt=notice_limit_dt) | Q(is_email_confirmed=False))):
            account.delete()

        # notice accounts that will soon get removed
        for account in Account.objects.filter(
                last_login__lt=login_limit_dt + timedelta(days=notice_limit_days),
                expiration_notification__isnull=True,
                is_email_confirmed=True):
            account.send_account_expiration_notice()

        # reset expiration_notification flag if account got used
        for account in Account.objects.filter(
                last_login__gt=login_limit_dt + timedelta(days=notice_limit_days),
                expiration_notification__isnull=False):
            account.expiration_notification = None
            account.save(update_fields=["expiration_notification"])


# method for updating
@receiver(post_init, sender=Account, dispatch_uid="save_old_values")
def save_old_values(instance,**kwargs):
    instance._old_email = instance.email
    instance._old_username = instance.username
    instance._old_db_password = instance.db_password
    instance._old_wdb_is_db_user = instance.wdb_is_db_user

@receiver(post_save, sender=Account, dispatch_uid="update_db_user")
def update_db_user(instance, created, **kwargs):
    with wdb_engine.connect() as cursor:
        if instance.wdb_is_db_user:
            if created or instance._old_wdb_is_db_user!=instance.wdb_is_db_user:
                if instance.db_password is None or instance.db_password == "":
                    db_password = Account.objects.make_random_password(30)
                else:
                    db_password = instance.db_password
                cursor.execute(text(f"""
                    CREATE USER "{instance.username}"
                    NOSUPERUSER NOCREATEDB NOCREATEROLE
                    INHERIT IN ROLE "weather_users"
                    LOGIN PASSWORD '{db_password}';"""))
                instance.db_password = db_password
                instance._old_db_password = db_password
                instance._old_wdb_is_db_user = instance.wdb_is_db_user
                instance.save()
            elif instance._old_username!=instance.username:
                cursor.execute(text(f"""
                    ALTER USER "{instance._old_username}"
                    RENAME TO "{instance.username}";"""))
            elif instance._old_db_password!=instance.db_password:
                cursor.execute(text(f"""
                    ALTER USER "{instance.username}"
                    WITH PASSWORD '{instance.db_password}';"""))
        elif instance._old_wdb_is_db_user!=instance.wdb_is_db_user:
            cursor.execute(text(
                f"DROP USER IF EXISTS \"{instance.username}\";"))

        if instance.email!=instance._old_email and instance.is_email_confirmed:
            instance.is_email_confirmed = False
            instance._old_email = instance.email
            instance.save()


class TokenPermission(models.Model):
    def get_default_token():
        return secrets.token_urlsafe(42)

    def get_default_valid_until():
        return timezone.now() + timedelta(days=30)

    token = models.CharField(
        max_length=60,
        primary_key=True,
        blank=False,
        default=get_default_token)
    description = models.TextField(
        max_length=300, blank=False)
    permissions = models.ManyToManyField(
        Permission,
        blank=True,
        default=None)
    valid_until = models.DateTimeField(
        blank=False,
        null=False,
        default=get_default_valid_until)

    def __str__(self):
        return self.description

    @staticmethod
    def is_token_allowed_app(token, app):
        if TokenPermission.objects.filter(token=token).exists():
            return TokenPermission.objects.filter(
                token=token,
                valid_until__gt=timezone.now(),
                permissions__app=app,
                ).exists()
        return False
    class Meta:
        verbose_name = 'Token Permission'
        verbose_name_plural = 'Token Permission'
        db_table_comment = "Permissions granted via a token to be used for a limited time to access the Hydro-Apps."
