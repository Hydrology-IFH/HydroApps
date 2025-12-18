# from django.http import HttpResponse # static http page
from django.shortcuts import render

from my_auth.decorators import check_permissions
from my_auth.config import USER_CLASS, EDIT_USER_CLASS
from .config import AQUARIUS_APP_NAME
from ..config import APP_NAME as INTERNAL_APP_NAME
from ..context_processor import internal_context_processor

# Create your views here.
@check_permissions([
    f'{INTERNAL_APP_NAME}.{USER_CLASS}',
    f'{AQUARIUS_APP_NAME}.{USER_CLASS}'])
def aquarius_view(request, *args, **kwargs):
    return render(request, "internal/aquarius/aquarius.html", {
        "permission_edit": request.user.has_perm(f'{AQUARIUS_APP_NAME}.{EDIT_USER_CLASS}'),
        **internal_context_processor(request)
    })
