# from django.http import HttpResponse # static http page
from django.shortcuts import render
from django.db.models import Max, Min
from django.db.models.functions import ExtractYear
from .models import KombStRAData, KombStRASRIMaxEvents
from main.decorators import unreleased
from django.db.models.expressions import RawSQL

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    return render(request, "kombstra/home.html", {})

@unreleased
def map_view(request, *args, **kwargs):
    context = {
        "spans": KombStRAData.objects.aggregate(
            max_year=ExtractYear(Max('date'), default=2021),
            min_year=ExtractYear(Min('date'), default=2001),
            max_rank=Max('event_rank', default=15),
            max_nevents=Max(RawSQL("""
                SELECT MAX(count)
                FROM (SELECT count(*)
                      FROM (SELECT grid_id
                            FROM kombstra_data
                            GROUP BY grid_id, date)
                      GROUP BY grid_id)""", []))
        )
    }
    context["spans"]["nevents"] = {
        qs["sri"]: qs["max_events"] for qs in KombStRASRIMaxEvents.objects.values()}
    return render(request, "kombstra/map.html", context)

@unreleased
def method_view(request, *args, **kwargs):
    return render(request, "kombstra/method.html", {})