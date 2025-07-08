# from django.http import HttpResponse # static http page
from django.shortcuts import render
from main.decorators import unreleased

# Create your views here.
@unreleased
def home_view(request, *args, **kwargs):
    return render(request, "internal/home.html", {})