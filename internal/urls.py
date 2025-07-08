"""Internals URL Configuration
"""
from django.urls import path, include

from .views import home_view


app_name = 'internal'
urlpatterns = [
    path('', home_view, name="home"),
    path('aquarius/', include('internal.aquarius.urls', "aquarius")),
]