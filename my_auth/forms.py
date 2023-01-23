from django.contrib.auth.forms import UserCreationForm, UserChangeForm, PasswordResetForm
from django import forms
from .models import Account
from django.core.exceptions import ValidationError
from hcaptcha.fields import hCaptchaField

personal_introduction_widget = forms.Textarea(
    attrs={
        "rows":2, 
        "class": "form-control",
        "placeholder": "Why should you be granted access to the WeatherDB database? Explain in your own words",
        "title": "This information will get used to decide whether you are granted access to the database. The information will only be visible to you and the admin of this site."})

class CustomUserCreationForm(UserCreationForm):
    hcaptcha = hCaptchaField()

    class Meta(UserCreationForm.Meta):
        model = Account
        fields = UserCreationForm.Meta.fields + ("email", "first_name", "last_name", "personal_introduction")
        widgets = {"personal_introduction": personal_introduction_widget}

    def clean_username(self):
        username = self.cleaned_data['username'].lower()
        new = Account.objects.filter(username = username)
        if new.count():
            raise ValidationError("User Already Exist")
        return username

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        new = Account.objects.filter(email=email)
        if new.count():
            raise ValidationError("Email Already Exist")
        return email

    def save(self, commit = True):
        user = Account.objects.create_user(
            username=self.cleaned_data['username'],
            email=self.cleaned_data['email'],
            password=self.cleaned_data['password1'],
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            personal_introduction=self.cleaned_data['personal_introduction'],
            is_email_confirmed=False,
            is_active=False,
        )
        return user

class CustomUserChangeForm(forms.ModelForm):
    db_password = forms.CharField(
        max_length=50,
        required=False,
        help_text='This is the Password to log into the database. Please use this together with your username to use the python package.',
        disabled=True,
        label="WeatherDB API Password"
    )
    max_downloads = forms.CharField(
        max_length=10,
        required=False,
        help_text='This is the number of stations you can download at once from this Website.',
        disabled=True,
        label="Maximum allowed Stations to download at once"
    )

    class Meta(UserChangeForm.Meta):
        model = Account
        fields = ("email", "username", "first_name", "last_name", "db_password", "max_downloads", "personal_introduction")
        widgets = {"personal_introduction": personal_introduction_widget}

    def username_clean(self):
        username = self.cleaned_data['username'].lower()
        new = Account.objects.filter(username = username)
        if new.count():
            raise ValidationError("User Already Exist")
        return username

    def email_clean(self):
        email = self.cleaned_data['email'].lower()
        new = Account.objects.filter(email=email)
        if new.count():
            raise ValidationError("Email Already Exist")
        return email

    # def save(self, commit = True):
    #     user = Account.objects.create_user(
    #         username=self.cleaned_data['username'],
    #         email=self.cleaned_data['email'],
    #         password=self.cleaned_data['password1'],
    #         first_name=self.cleaned_data['first_name'],
    #         last_name=self.cleaned_data['last_name'],
    #         is_email_confirmed=False,
    #         is_active=False,
    #     )
    #     return user

class CustomPasswordResetForm(PasswordResetForm):
    hcaptcha = hCaptchaField()