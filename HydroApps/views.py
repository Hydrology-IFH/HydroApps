from django.shortcuts import render
from main.utils.utils import get_context_extra
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import HydroApps

def home_view(request, *args, **kwargs): 
    context = get_context_extra(request, **kwargs)
    if context["show_unreleased"]:
        context.update({"apps": HydroApps.objects.all()})
    else:
        context.update({"apps": HydroApps.objects.get(is_released=True)})
    return render(request, "HydroApps/home.html", context)

def redirect_to_base(request):
    # to remove the HydroApps part from an URL
    return HttpResponseRedirect(reverse('HydroApps:home'))