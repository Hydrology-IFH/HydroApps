# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import KombStRADataSpans

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "kombstra/home.html", {})

def map_view(request, *args, **kwargs):
    context = {
        "spans": KombStRADataSpans.objects.all().values()[0]
    }
    return render(request, "kombstra/map.html", context)

def method_view(request, *args, **kwargs):
    return render(request, "kombstra/method.html", {})