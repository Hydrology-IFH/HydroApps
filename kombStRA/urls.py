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
from django.urls import path, include
from django.views.i18n import JavaScriptCatalog
from django.views.decorators.cache import cache_page
from rest_framework.routers import DefaultRouter

from .views import (home_view, map_view, method_view)
from .apis import KombStRADataViewSet, KombStRAGridViewSet

router = DefaultRouter()
router.register(r'kombstra_data', KombStRADataViewSet)
router.register(r'kombstra_grid', KombStRAGridViewSet)

app_name = 'KombStRA'
urlpatterns = [
    path('', home_view, name="home"),
    path('map', map_view, name="map"),
    path('method', method_view, name="method"),
    path('jsi18n',
         cache_page(86400, key_prefix='jsi18n')(
            JavaScriptCatalog.as_view(packages=['KombStRA'])),
         name='javascript-catalog'),
    path('api/', include(router.urls)),
]