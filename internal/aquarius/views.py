# from django.http import HttpResponse # static http page
from django.shortcuts import render

from main.decorators import unreleased
from .config import AQUARIUS_PERMISSION_APP, PERMISSION_CLASS_EDIT, PERMISSION_CLASS_READ

# Create your views here.
@unreleased
def aquarius_view(request, *args, **kwargs):
    return render(request, "internal/aquarius/aquarius.html", {
        "permission_edit": request.user.has_perm(f'{AQUARIUS_PERMISSION_APP}.{PERMISSION_CLASS_EDIT}'),
        "permission_read": request.user.has_perm(f'{AQUARIUS_PERMISSION_APP}.{PERMISSION_CLASS_READ}'),
    })
