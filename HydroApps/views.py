from django.shortcuts import render
from main.utils.utils import get_context_extra
from django.http import HttpResponseRedirect
from django.urls import reverse

def home_view(request, *args, **kwargs): 
    return render(request, "HydroApps/home.html", get_context_extra(request, **kwargs))

def redirect_to_base(request):
    # to remove the HydroApps part from an URL
    return HttpResponseRedirect(reverse('HydroApps:home'))