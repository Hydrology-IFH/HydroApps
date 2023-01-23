from django.shortcuts import render
from main.settings import DEBUG
from .utils.utils import get_context
CONTEXT_BASE = {
    "debug": DEBUG
}

def impressum_view(request, *args, **kwargs):
    return render(request, "impressum.html", get_context(request))

def home_view(request, *args, **kwargs):
    return render(request, "home.html", CONTEXT_BASE)