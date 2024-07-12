# from django.http import HttpResponse # static http page
from django.shortcuts import render
from main.decorators import unreleased

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    return render(request, "sfi_demo/home.html", {})

@unreleased
def app_view(request, *args, **kwargs):
    return render(request, "sfi_demo/app.html", {})

@unreleased
def method_view(request, *args, **kwargs):
    return render(request, "sfi_demo/method.html", {})