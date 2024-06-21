# from django.http import HttpResponse # static http page
from django.shortcuts import render
from main.decorators import unreleased

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    return render(request, "app_name/home.html", {})

@unreleased
def map_view(request, *args, **kwargs):
    return render(request, "app_name/map.html", {})

@unreleased
def method_view(request, *args, **kwargs):
    return render(request, "app_name/method.html", {})