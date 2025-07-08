"""Internals URL Configuration
"""
from django.urls import path

from .views import aquarius_view
from .apis.proxy import AquariusAPIProxyView


app_name = 'aquarius'
urlpatterns = [
    path("", aquarius_view, name="app"),
    path("api/proxy/<str:endpoint>", AquariusAPIProxyView.as_view(), name="aquarius_api_proxy"),
]