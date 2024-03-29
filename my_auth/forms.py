from django.contrib.auth.forms import UserCreationForm, UserChangeForm, PasswordResetForm
from django import forms
from .models import Account
from django.core.exceptions import ValidationError
from hcaptcha.fields import hCaptchaField
from django.utils.translation import gettext_lazy as _

personal_introduction_widget = forms.Textarea(
    attrs={
        "rows":2,
        "class": "form-control",
        "placeholder": _("Why should you be granted access to the Hydro-Apps resources? Explain in your own words"),
        "title": _("This information will get used to decide whether you are granted access to the database. The information will only be visible to you and the admin of this site.")})

class CustomUserCreationForm(UserCreationForm):
    hcaptcha = hCaptchaField()

    class Meta(UserCreationForm.Meta):
        model = Account
        fields = UserCreationForm.Meta.fields + \
            ("email",
             "first_name",
             "last_name",
             "personal_introduction",
             "confirmed_data_policy")
        widgets = {
            "personal_introduction": personal_introduction_widget,
        }
        help_texts = {
            "confirmed_data_policy": "<a href='/datenschutz' id='link_privacy'>{0}</a>".format(_("Privacy agreement")),
        }

    def clean_username(self):
        username = self.cleaned_data['username'].lower()
        new = Account.objects.filter(username = username)
        if new.count():
            raise ValidationError(_("User Already Exist"))
        return username

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        new = Account.objects.filter(email=email)
        if new.count():
            raise ValidationError(_("Email Already Exist"))
        return email

    def save(self, commit = True):
        user = Account.objects.create_user(
            username=self.cleaned_data['username'],
            email=self.cleaned_data['email'],
            password=self.cleaned_data['password1'],
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            personal_introduction=self.cleaned_data['personal_introduction'],
            confirmed_data_policy=self.cleaned_data['confirmed_data_policy'],
            is_email_confirmed=False,
            is_active=False
        )
        return user

class CustomUserChangeForm(forms.ModelForm):
    db_password = forms.CharField(
        max_length=50,
        required=False,
        help_text=_('This is the Password to log into the database. Please use this together with your username to use the python package.'),
        disabled=True,
        label="WeatherDB API Password"
    )
    wdb_max_downloads = forms.CharField(
        max_length=10,
        required=False,
        help_text=_('This is the number of stations you can download at once from this Website.'),
        disabled=True,
        label=_("Maximum allowed Stations to download at once")
    )

    class Meta(UserChangeForm.Meta):
        model = Account
        fields = ("email", "username", "first_name", "last_name", "db_password", "wdb_max_downloads", "personal_introduction")
        widgets = {"personal_introduction": personal_introduction_widget}

    def username_clean(self):
        username = self.cleaned_data['username'].lower()
        new = Account.objects.filter(username = username)
        if new.count():
            raise ValidationError(_("User Already Exist"))
        return username

    def email_clean(self):
        email = self.cleaned_data['email'].lower()
        new = Account.objects.filter(email=email)
        if new.count():
            raise ValidationError(_("Email Already Exist"))
        return email

class CustomPasswordResetForm(PasswordResetForm):
    hcaptcha = hCaptchaField()

    def save(self,
             email_template_name="emails/password_reset_email.html",
             subject_template_name="emails/password_reset_subject.txt",
             **kwargs):
        return super().save(
            email_template_name=email_template_name,
            subject_template_name=subject_template_name, **kwargs)