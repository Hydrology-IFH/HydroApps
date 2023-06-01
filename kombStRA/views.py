# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import KombStRAGrid
import json
from django.core.serializers import serialize
from main.utils.utils import get_context_base

# Create your views here.
def home_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "KombStRA/home.html", context)

def map_view(request, *args, **kwargs):
    context = get_context_base(request)
    context.update({
        'base_grid': json.loads(serialize("geojson", KombStRAGrid.objects.all()))
        })
    return render(request, "KombStRA/map.html", context)

def method_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "KombStRA/method.html", context)

def package_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "KombStRA/package.html", context)