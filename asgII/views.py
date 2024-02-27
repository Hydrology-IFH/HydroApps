# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import MetaN
import json
from django.core.serializers import serialize

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "asgII/home.html", {})

def map_view(request, *args, **kwargs):
    context = {
        'meta_n': json.loads(serialize("geojson", MetaN.objects.all()))
        }
    return render(request, "asgII/asgII_map.html", context)

def method_view(request, *args, **kwargs):
    return render(request, "asgII/method.html", {})

def package_view(request, *args, **kwargs):
    return render(request, "asgII/package.html", {})