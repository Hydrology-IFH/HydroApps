from django.shortcuts import render
from main.utils.utils import get_context

def home_view(request, *args, **kwargs): 
    return render(request, "HydroApps\home.html", get_context(request, **kwargs))