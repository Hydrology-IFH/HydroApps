from django import forms
from hcaptcha.fields import hCaptchaField

class HCaptchaForm(forms.Form):
    hcaptcha = hCaptchaField(required=True)