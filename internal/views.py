# from django.http import HttpResponse # static http page
from django.shortcuts import render

from my_auth.config import USER_CLASS
from my_auth.decorators import check_permissions
from .config import APP_NAME
from .context_processor import internal_context_processor

# Create your views here.
@check_permissions([f'{APP_NAME}.{USER_CLASS}'])
def home_view(request, *args, **kwargs):
    return render(request, "internal/home.html", internal_context_processor(request))