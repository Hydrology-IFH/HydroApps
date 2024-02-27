from django.shortcuts import render

def impressum_view(request, *args, **kwargs):
    return render(request, "impressum.html", {})

def datenschutz_view(request, *args, **kwargs):
    return render(request, "datenschutz.html", {})