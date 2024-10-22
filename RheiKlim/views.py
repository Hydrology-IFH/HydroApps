# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import MetaN
import json
from django.core.serializers import serialize

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "RheiKlim/home.html", {})

def map_view(request, *args, **kwargs):
    context = {
        'meta_n': json.loads(serialize("geojson", MetaN.objects.all()))
        }
    return render(request, "RheiKlim/RheiKlim_map.html", context)

def method_view(request, *args, **kwargs):
    return render(request, "RheiKlim/method.html", {})

def package_view(request, *args, **kwargs):
    return render(request, "RheiKlim/package.html", {})