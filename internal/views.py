# from django.http import HttpResponse # static http page
from django.shortcuts import render
from main.decorators import unreleased
from .models import AquariusLocations

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    return render(request, "internal/home.html", {})

@unreleased
def aquarius_view(request, *args, **kwargs):
    locations = AquariusLocations.objects.filter(geometry_neq=None).order_by("lastModified")
    return render(request, "internal/aquarius.html", {locations:locations})