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
from main.settings import DEBUG
from django.views.decorators.csrf import csrf_protect
from distutils.util import strtobool

from .token import account_activation_token
from .models import Account # ExtendedUser
from .forms import CustomUserCreationForm, CustomUserChangeForm, CustomPasswordResetForm
from django.contrib.auth.views import (
    LoginView, LogoutView
)
from main.utils.utils import get_context_extra

# Create your views here.
@csrf_protect
def register(request, **kwargs):
    context = get_context_extra(request, **kwargs)

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
            user.send_confirm_user(request)
        context = get_context_extra(request, **kwargs)
        context.update({'user': user})
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
            context = get_context_extra(request, **kwargs)
            context.update({"conf_user": user})
        return render(
                request,
                "registration/registration_user_confirmed.html",
                context
            )
    else:
        return HttpResponse('Activation link is invalid!')

def request_reset_password(request, **kwargs):
    context = get_context_extra(request, **kwargs)
    if request.method == 'POST':
        form = CustomPasswordResetForm(request.POST)
        if form.is_valid():
            form.save(request=request)
            return render(request, 'registration/password_reset_request_confirm.html', context)
    else:
        context.update(dict(form = CustomPasswordResetForm()))
    return render(request, 'registration/password_reset_request_form.html', context)

@login_required
@csrf_protect
def request_db_access(request, **kwargs):
    context = get_context_extra(request, **kwargs)
    if request.user.is_email_confirmed and request.user.is_active:
        request.user.send_admin_request_db_access(request)
        context.update({"email_send": True})
    else:
        context.update({"email_send": False})
    return render(request, 'registration/request_db_access_send.html', context)

@login_required
@csrf_protect
def renew_db_password(request, **kwargs):
    request.user.renew_db_password()
    return redirect(to='user_profile')

@login_required
@csrf_protect
def profile(request, **kwargs):
    context = get_context_extra(request, **kwargs)
    context.update(dict(
        is_email_confirmed=request.user.is_email_confirmed,
        is_active=request.user.is_active))
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

@login_required
@csrf_protect
def change_password(request, **kwargs):
    context = get_context_extra(request, **kwargs)
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

class MyLoginView(LoginView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(get_context_extra(self.request))
        return context
    
    def get_default_redirect_url(self):
        active_app = get_context_extra(self.request)["active_app"]
        return f"/{active_app}/auth/accounts/profile/"


class MyLogoutView(LogoutView):
    def get_next_page(self):
        active_app = get_context_extra(self.request)["active_app"]
        return f"/{active_app}/"
