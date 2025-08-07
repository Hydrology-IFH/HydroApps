"""Internals URL Configuration
"""
from django.urls import path, include

from .views import aquarius_view
from .apis.proxy import AquariusAPIProxyView
from .apis.api import router as aquarius_router


app_name = 'aquarius'
urlpatterns = [
    path("", aquarius_view, name="app"),
    path("api/", include((aquarius_router.urls, "api"))),
    path("api_proxy/<str:endpoint>/<str:route>/",
         AquariusAPIProxyView.as_view(),
         name="aquarius_api_proxy"),
]