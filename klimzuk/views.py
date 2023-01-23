# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import MetaN
import json
from django.core.serializers import serialize
from main.settings import DEBUG
from pathlib import Path

CONTEXT_BASE = {
    "debug": DEBUG
}

app_dir = Path(__file__).parent

# Create your views here.
def home_view(request, *args, **kwargs):
    context = CONTEXT_BASE
    return render(request, "klimzuk\home.html", context)

def map_view(request, *args, **kwargs):
    context = CONTEXT_BASE.copy()
    context.update({
        'meta_n': json.loads(serialize("geojson", MetaN.objects.all()))
        })
    return render(request, "klimzuk\klimzuk_map.html", context)

def method_view(request, *args, **kwargs):
    context = CONTEXT_BASE.copy()
    return render(request, "klimzuk\method.html", context)

def package_view(request, *args, **kwargs):
    context = CONTEXT_BASE.copy()
    return render(request, "klimzuk\package.html", context)