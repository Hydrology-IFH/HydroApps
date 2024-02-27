from django.shortcuts import render, redirect
# from django.core.mail import EmailMessage
# from django.contrib.sites.shortcuts import get_current_site
# from django.template.loader import render_to_string
# from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.views.decorators.csrf import csrf_protect
from distutils.util import strtobool
from django.urls import reverse_lazy

from .token import account_activation_token
from .models import Account
from .forms import CustomUserCreationForm, CustomUserChangeForm, CustomPasswordResetForm
from django.contrib.auth.views import (
    PasswordResetView, PasswordResetDoneView,
    PasswordResetConfirmView, PasswordResetCompleteView
)
from main import settings

# Create your views here.
#########################
# registration views
@csrf_protect
def register(request, **kwargs):
    context = {"HCAPTCHA_SITEKEY": settings.HCAPTCHA_SITEKEY}
    context = {}

    if request.method == "GET":
        context.update({"form": CustomUserCreationForm})
        return render(
            request,
            "registration/registration_form.html",
            context
        )
    elif request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.send_email_confirmation(request=request)
            context.update({"email": form.cleaned_data.get('email')})
            return render(
                request,
                "registration/registration_done.html",
                context
            )
        else:
            context.update({"form": form})
            return render(
                request,
                "registration/registration_form.html",
                context
            )

@login_required
def resend_email_confirmation(request, **kwargs):
    request.user.send_email_confirmation(request=request)
    messages.success(request, "A new Email confirmation was send to " + request.user.email, extra_tags="alert-success")
    return redirect(to='user_profile')

def confirm_email(request, uidb64, token, **kwargs):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Account._default_manager.get(pk=uid)
    except(TypeError, ValueError, OverflowError, Account.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_email_confirmed = True
        user.save()
        if not user.is_active:
            user.send_admin_confirm_user(request)
        context = {'user': user}
        return render(
                request,
                "registration/registration_email_confirmed.html",
                context
            )
    else:
        return HttpResponse('Activation link is invalid!')

def confirm_user(request, uidb64, token, **kwargs):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Account._default_manager.get(pk=uid)
    except(TypeError, ValueError, OverflowError, Account.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_user_confirmed = True
        user.save()
        if user.is_email_confirmed:
            user.is_active = True
            if "grant_db_access" in request.GET and bool(strtobool(request.GET["grant_db_access"])):
                user.wdb_is_db_user = True
            user.save()
            user.send_activation_notice(request)
            context = {"conf_user": user}
        return render(
                request,
                "registration/registration_user_confirmed.html",
                context
            )
    else:
        return HttpResponse('Activation link is invalid!')

# Password reset views
class MyPasswordResetView(PasswordResetView):
    # View to request a password reset
    success_url = reverse_lazy('password_reset_done', kwargs={"app_name": "HydroApps"})
    template_name = "registration/password_reset_request_form.html"
    email_template_name = "emails/password_reset_email.html"
    subject_template_name = "emails/password_reset_subject.txt"
    form_class = CustomPasswordResetForm

class  MyPasswordResetDoneView(PasswordResetDoneView):
    # after password request was send
    template_name = "registration/password_reset_request_done.html"

class MyPasswordResetConfirmView(PasswordResetConfirmView):
    # View to reset password
    success_url = reverse_lazy('password_reset_complete', kwargs={"app_name": "HydroApps"})
    template_name = "registration/password_reset_form.html"

class MyPasswordResetCompleteView(PasswordResetCompleteView):
    # after password was reset
    template_name = "registration/password_reset_complete.html"

# Profile view
@login_required
@csrf_protect
def profile(request, **kwargs):
    context = dict(
        is_email_confirmed=request.user.is_email_confirmed,
        is_active=request.user.is_active)
    if request.method == 'POST':
        context.update(dict(form = CustomUserChangeForm(request.POST, instance=request.user)))
        if context["form"].is_valid():
            context["form"].save()
            context.update(dict(
                is_email_confirmed=request.user.is_email_confirmed,
                is_active=request.user.is_active))
            messages.success(request, 'Your profile got successfully updated', extra_tags='alert-success')
        else:
            messages.error(request, 'There was an error while updating your profile.', extra_tags='alert-danger')
        return render(request, 'users/profile.html', context)
    else:
        context.update(dict(form = CustomUserChangeForm(instance=request.user)))
        return render(request, 'users/profile.html', context)


# change password view
@login_required
@csrf_protect
def change_password(request, **kwargs):
    context = {}
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            return render(request, 'users/password_change_done.html', context)
        else:
            context.update(dict(form=form))
            # messages.error(request, 'Please correct the error below.')
    else:
        context.update(dict(form = PasswordChangeForm(request.user)))
    return render(request, 'users/password_change_form.html', context)

# setting database password
@login_required
@csrf_protect
def request_db_access(request, **kwargs):
    if request.user.is_email_confirmed and request.user.is_active:
        request.user.send_admin_request_db_access(request)
        context = {"email_send": True}
    else:
        context = {"email_send": False}
    return render(request, 'registration/request_db_access_send.html', context)

@login_required
@csrf_protect
def renew_db_password(request, **kwargs):
    request.user.renew_db_password()
    return redirect(to='user_profile')