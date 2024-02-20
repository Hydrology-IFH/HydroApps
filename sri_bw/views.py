# from django.http import HttpResponse # static http page
from django.shortcuts import render
from main.utils.utils import get_context_base
from main.decorators import unreleased
from django.db.models import Max, Min
from django.db.models.functions import ExtractYear
from .models import SRIBWData

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "sri-bw/home.html", context)

@unreleased
def map_view(request, *args, **kwargs):
    context = get_context_base(request)
    context.update({
        "spans": SRIBWData.objects.aggregate(
            max_year=ExtractYear(Max('date'), default=2021),
            min_year=ExtractYear(Min('date'), default=2001),
            max_rank=Max('event_rank', default=15))
    })
    return render(request, "sri-bw/map.html", context)

@unreleased
def method_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "sri-bw/method.html", context)