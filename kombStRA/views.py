# from django.http import HttpResponse # static http page
from django.shortcuts import render
from main.utils.utils import get_context_base
from main.decorators import unreleased

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "kombstra/home.html", context)

@unreleased
def map_view(request, *args, **kwargs):
    context = get_context_base(request)
    # context.update({
    #     'base_grid': json.loads(serialize("geojson", KombStRAPolygons.objects.all()))
    #     })
    return render(request, "kombstra/map.html", context)

@unreleased
def method_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "kombstra/method.html", context)