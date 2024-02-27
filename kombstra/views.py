# from django.http import HttpResponse # static http page
from django.shortcuts import render
from django.db.models import Max, Min
from django.db.models.functions import ExtractYear
from .models import KombStRAData

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "kombstra/home.html", {})

def map_view(request, *args, **kwargs):
    context = {
        "spans": KombStRAData.objects.aggregate(
            max_year=ExtractYear(Max('date'), default=2021),
            min_year=ExtractYear(Min('date'), default=2001),
            max_rank=Max('event_rank', default=15))
    }
    return render(request, "kombstra/map.html", context)

def method_view(request, *args, **kwargs):
    return render(request, "kombstra/method.html", {})