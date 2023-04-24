from django.db import models
# from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.db import connections
from django.db.models.signals import post_save, post_init
from django.dispatch import receiver
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes
from django.conf import settings
from .token import account_activation_token

# Create your models here.
class AccountManager(BaseUserManager):
    def create_user(self,email,username,first_name,last_name ,password,**other_fields):
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

        

class Account(AbstractBaseUser,PermissionsMixin):
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
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_tester = models.BooleanField(default=False,
        help_text=_('Designates whether the user can see features that didn\'t yet get released.'),
    )
    wdb_is_db_user = models.BooleanField(default=False,
        help_text=_('Designates whether the user can log into the WeatherDB-database.'),
    )
    wdb_max_downloads = models.IntegerField(
        default=10, help_text=_('Designates the number of stations a user can download at once on the WeatherDB App.'))

    # is_admin      = models.BooleanField(default=False)
    is_superuser  = models.BooleanField(default=False,
        help_text=_('Designates whether the user is superuser.'),)
    db_password = models.CharField(max_length=30, null=True, blank=True,
        help_text=_('The Password for this user to log into the database.'))

    objects = AccountManager()
    USERNAME_FIELD = 'username'#'email'
    REQUIRED_FIELDS = ['email', 'first_name', "last_name"]

    def __str__(self):
        return self.email

    def renew_db_password(self):
        self.db_password = Account.objects.make_random_password(30)
        self.save()

    def remove(self, **kwargs):
        if self.is_active and self.wdb_is_db_user:
            with connections["weatherdb"].cursor() as cursor:
                cursor.execute(
                    f"DROP USER IF EXISTS \"{self.username}\";")

    @staticmethod
    def _get_domain(request):
        if request is None:
            return settings.BASE_DOMAIN
        else:
            return "https://" + get_current_site(request).domain

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

    def send_confirm_user(self, request=None):
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
            to=[self.email]
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
            to=[self.email]
        )
        email.send()


# method for updating
@receiver(post_init, sender=Account, dispatch_uid="save_old_values")
def save_old_values(instance,**kwargs):
    instance._old_email = instance.email
    instance._old_username = instance.username
    instance._old_db_password = instance.db_password
    instance._old_wdb_is_db_user = instance.wdb_is_db_user

@receiver(post_save, sender=Account, dispatch_uid="update_db_user")
def update_db_user(instance, created, **kwargs):
    with connections["weatherdb"].cursor() as cursor:
        if instance.wdb_is_db_user:
            if created or instance._old_wdb_is_db_user!=instance.wdb_is_db_user:
                if instance.db_password is None or instance.db_password == "":
                    db_password = Account.objects.make_random_password(30)
                else:
                    db_password = instance.db_password
                cursor.execute(f"""
                    CREATE USER "{instance.username}" 
                    NOSUPERUSER NOCREATEDB NOCREATEROLE 
                    INHERIT IN ROLE "weather_users" 
                    LOGIN PASSWORD '{db_password}';""")
                instance.db_password = db_password
                instance._old_db_password = db_password
                instance._old_wdb_is_db_user = instance.wdb_is_db_user
                instance.save()
            elif instance._old_username!=instance.username:
                cursor.execute(f"""
                    ALTER USER "{instance._old_username}"
                    RENAME TO "{instance.username}";""")
            elif instance._old_db_password!=instance.db_password:
                cursor.execute(f"""
                    ALTER USER "{instance.username}"  
                    WITH PASSWORD '{instance.db_password}';""")
        elif instance._old_wdb_is_db_user!=instance.wdb_is_db_user:
            cursor.execute(
                f"DROP USER IF EXISTS \"{instance.username}\";")
    
        if instance.email!=instance._old_email and instance.is_email_confirmed:
            instance.is_email_confirmed = False
            instance._old_email = instance.email
            instance.save()



