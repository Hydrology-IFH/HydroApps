# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import MetaN
import json
from django.core.serializers import serialize
from main.settings import DEBUG
from pathlib import Path
from main.utils.utils import get_context_base
from main.decorators import unreleased

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "asgII/home.html", context)

@unreleased
def map_view(request, *args, **kwargs):
    context = get_context_base(request)
    context.update({
        'meta_n': json.loads(serialize("geojson", MetaN.objects.all()))
        })
    return render(request, "asgII/asgII_map.html", context)

@unreleased
def method_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "asgII/method.html", context)

@unreleased
def package_view(request, *args, **kwargs):
    context = get_context_base(request)
    return render(request, "asgII/package.html", context)