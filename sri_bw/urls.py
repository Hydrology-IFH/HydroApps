"""SRI-BW URL Configuration

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
from rest_framework.routers import DefaultRouter

from .views import (home_view, map_view, method_view)
from .apis import SRIBWDataViewSet, SRIBWPolygonsViewSet

router = DefaultRouter()
router.register(r'sri_bw_data', SRIBWDataViewSet, basename="sri_bw")
router.register(r'sri_bw_polygon', SRIBWPolygonsViewSet, basename="sri_bw")

app_name = 'sri_bw'
urlpatterns = [
    path('', home_view, name="home"),
    path('map', map_view, name="map"),
    path('method', method_view, name="method"),
    path('api/', include(router.urls)),
]