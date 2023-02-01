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
from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView
from .views import impressum_view, datenschutz_view
from django.conf.urls.i18n import i18n_patterns


#from weatherDB.urls import urlpatterns as weatherDB_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path("favicon.ico",
        RedirectView.as_view(url=staticfiles_storage.url("favicon.ico"))
    ),
    path('i18n/', include('django.conf.urls.i18n')),
    *i18n_patterns(
        path("", include("HydroApps.urls")),
        path("weatherdb/", include("weatherDB.urls")),
        path("<str:app_name>/impressum/", impressum_view, name="impressum"),
        path("<str:app_name>/datenschutz/", datenschutz_view, name="datenschutz"),
        path("klimzuk/", include("klimzuk.urls")),
        path("<str:app_name>/auth/", include("my_auth.urls")),
        path("<str:app_name>/impressum/", impressum_view, name="impressum"),
        path("<str:app_name>/datenschutz/", datenschutz_view, name="datenschutz"),
    )
]