from django import forms
from hcaptcha.fields import hCaptchaField
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.translation import gettext as _

from my_auth.models import Account, PermissionClass, Permission
from HydroApps.models import App

class FeedbackForm(forms.Form):
    name = forms.CharField(max_length=100, required=True, label="Name")
    email = forms.EmailField(required=True, label="E-Mail")
    message = forms.CharField(widget=forms.Textarea, required=True, label=_("Message"))
    hcaptcha = hCaptchaField(required=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if kwargs.get("request") is not None:
            self.fields["hcaptcha"].set_request(kwargs.get("request"))

    def send_email(self):
        # send email to all users with the feedback permission
        feedback_perm = Permission.objects.get(
            app=App.objects.get(name="sfi_demo"),
            permission_class=PermissionClass.objects.get(name="Feedback-receiver"))
        users = Account.objects.filter(permissions=feedback_perm).all()
        if len(users) == 0:
            raise Exception("No users with sfi_demo:Feedback-receiver permission found")
        for user in users:
            EmailMessage(
                '[HydroApps] '+_("Feedback from AVOSS SFI-Demonstrator"),
                render_to_string(
                    'sfi_demo/email_feedback.html', {
                        'name': self.cleaned_data['name'],
                        'message': self.cleaned_data['message'],
                        'user': user,
                    }),
                to=[user.email],
                reply_to=[self.cleaned_data['email']]
            ).send()

        # send confirmation email to the user
        EmailMessage(
            '[HydroApps]' + _("Feedback for AVOSS Web-Demonstrator sent"),
            render_to_string(
                'sfi_demo/email_feedback_confirmation.html', {
                    'name': self.cleaned_data['name'],
                    'message': self.cleaned_data['message'],
                }),
            to=[self.cleaned_data['email']]
        ).send()