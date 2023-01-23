from django.shortcuts import render
from main.settings import DEBUG
from main.utils.utils import get_base_template

CONTEXT_BASE = {
    "debug": DEBUG,
    "base_template": "HydroApps//base.html"
}
from main.utils.utils import get_context

def home_view(request, *args, **kwargs): 
    return render(request, "HydroApps\home.html", get_context(request))