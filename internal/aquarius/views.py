# from django.http import HttpResponse # static http page
from django.shortcuts import render

from main.decorators import unreleased
from .models import AquariusLocations


# Create your views here.
@unreleased
def aquarius_view(request, *args, **kwargs):
    locations = AquariusLocations.objects.filter(geometry__isnull=False).order_by("lastModified")
    return render(request, "internal/aquarius/aquarius.html", {"locations": locations})
