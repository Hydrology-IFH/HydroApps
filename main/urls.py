"""weatherDB_manager URL Configuration

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
from .views import impressum_view, home_view

#from weatherDB_manager.urls import urlpatterns as weatherDB_manager_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("HydroApps.urls")),
    path("weatherDB/", include("weatherDB_manager.urls")),
    path("weatherdb/", include("weatherDB_manager.urls")),
    path("weather/", include("weatherDB_manager.urls")),
    path("klimzuk/", include("klimzuk.urls")),
    # path("auth/", include("my_auth.urls")),
    path("<str:app_name>/auth/", include("my_auth.urls")),
    # path("impressum/", impressum_view, name="impressum"),
    path("<str:app_name>/impressum/", impressum_view, name="impressum"),
    path("favicon.ico",
        RedirectView.as_view(url=staticfiles_storage.url("favicon.ico"))
    )
]
