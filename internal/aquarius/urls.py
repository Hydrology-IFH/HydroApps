"""Internals URL Configuration
"""
from django.urls import path, include, re_path

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
    re_path(r"^api_proxy/(?P<endpoint>\w+)/(?P<route>\w+)/(?P<subroute>[\w/]+)/$",
            AquariusAPIProxyView.as_view(),
            name="aquarius_api_proxy_subroutes"),
]