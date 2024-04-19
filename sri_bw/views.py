# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import SRIBWDataSpans

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "sri_bw/home.html", {})

def map_view(request, *args, **kwargs):
    context = {
        "spans": SRIBWDataSpans.objects.all().values()[0]
    }
    return render(request, "sri_bw/map.html", context)

def method_view(request, *args, **kwargs):
    return render(request, "sri_bw/method.html", {})