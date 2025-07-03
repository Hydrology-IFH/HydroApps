"""Internals URL Configuration
"""
from django.urls import path

from .views import (home_view, aquarius_view)


app_name = 'internal'
urlpatterns = [
    path('', home_view, name="home"),
    path("aquarius/", aquarius_view, name="aquarius"),
]