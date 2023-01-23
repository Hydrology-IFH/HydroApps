from django.shortcuts import render
from main.settings import DEBUG

CONTEXT_BASE = {
    "debug": DEBUG
}

def impressum_view(request, *args, **kwargs):
    return render(request, "impressum.html", CONTEXT_BASE)

def home_view(request, *args, **kwargs):
    return render(request, "home.html", CONTEXT_BASE)