# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import KombStRADataSpans
from main.decorators import unreleased

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    return render(request, "kombstra/home.html", {})

@unreleased
def map_view(request, *args, **kwargs):
    context = {
        "spans": KombStRADataSpans.objects.all().values()[0]
    }
    return render(request, "kombstra/map.html", context)

@unreleased
def method_view(request, *args, **kwargs):
    return render(request, "kombstra/method.html", {})