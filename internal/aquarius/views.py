# from django.http import HttpResponse # static http page
from django.shortcuts import render

from main.decorators import unreleased
# from .models import Locations

# Create your views here.
@unreleased
def aquarius_view(request, *args, **kwargs):
    return render(request, "internal/aquarius/aquarius.html")
