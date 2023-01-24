from django.shortcuts import render
from main.settings import DEBUG
from .utils.utils import get_context_extra

def impressum_view(request, *args, **kwargs):
    return render(request, "impressum.html", get_context_extra(request, **kwargs))

def datenschutz_view(request, *args, **kwargs):
    return render(request, "datenschutz.html", get_context_extra(request, **kwargs))