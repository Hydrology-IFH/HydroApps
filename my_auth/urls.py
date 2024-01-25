
"""weatherDB URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import (register, confirm_email, confirm_user, profile,
                    change_password, renew_db_password,
                    resend_email_confirmation, request_db_access,
                    MyLoginView, MyLogoutView,
                    MyPasswordResetView, MyPasswordResetDoneView, MyPasswordResetConfirmView, MyPasswordResetCompleteView)

urlpatterns = [
    path("accounts/register/", register, name="register"),
    path("accounts/profile/", profile, name="user_profile"),
    path("accounts/password_change/", change_password, name="password_change"),
    path("accounts/renew_db_password/", renew_db_password, name="renew_db_password"),
    path('confirm_email/<uidb64>/<token>/', confirm_email, name='confirm_email'),
    path('accounts/request_db_access/', request_db_access, name='request_db_access'),
    path('confirm_user/<uidb64>/<token>/', confirm_user, name='confirm_user'),
    path('accounts/resend_email_confirmation/', resend_email_confirmation, name="resend_email_confirmation"),
    path("accounts/login/", MyLoginView.as_view(), name="login"),
    path("accounts/logout/", MyLogoutView.as_view(), name="logout"),
    path("accounts/password_reset/", MyPasswordResetView.as_view(), name="password_reset"),
    path("accounts/password_reset/done/", MyPasswordResetDoneView.as_view(), name="password_reset_done"),
    path("accounts/reset/<uidb64>/<token>/", MyPasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("accounts/reset/done", MyPasswordResetCompleteView.as_view(), name="password_reset_complete"),
]