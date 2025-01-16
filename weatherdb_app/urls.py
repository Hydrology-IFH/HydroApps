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
from django.views.i18n import JavaScriptCatalog
from django.views.decorators.cache import cache_page

from .views import (
    home, get_ts, download_ts, get_user_config,
    package_view, method_view)

app_name = 'weatherdb'
urlpatterns = [
    path('', home, name="home"),
    path('get_ts/', get_ts, name="get_ts"),
    path('download_ts/', download_ts, name="download_ts"),
    path('get_user_config/', get_user_config, name="get_user_config"),
    path('method/', method_view, name="method"),
    path('package/', package_view, name="package"),
    path('jsi18n/',
        cache_page(86400, key_prefix='jsi18n')(
            JavaScriptCatalog.as_view(packages=['weatherdb'])),
        name='javascript-catalog'),
]