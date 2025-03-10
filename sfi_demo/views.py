# from django.http import HttpResponse # static http page
from django.shortcuts import render

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "sfi_demo/home.html", {})

def app_view(request, *args, **kwargs):
    return render(request, "sfi_demo/app.html", {})

def method_view(request, *args, **kwargs):
    return render(request, "sfi_demo/method.html", {})