# from django.http import HttpResponse # static http page
from django.shortcuts import render
from main.decorators import unreleased

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    return render(request, "sfi_mockup/home.html", {})

@unreleased
def map_view(request, *args, **kwargs):
    return render(request, "sfi_mockup/map.html", {})

@unreleased
def method_view(request, *args, **kwargs):
    return render(request, "sfi_mockup/method.html", {})