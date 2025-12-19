# from django.http import HttpResponse # static http page
from django.shortcuts import render

from my_auth.decorators import check_permissions
from my_auth.config import USER_CLASS, EDIT_USER_CLASS
from my_auth.models import TokenPermission
from .config import AQUARIUS_APP_NAME
from ..config import APP_NAME as INTERNAL_APP_NAME
from ..context_processor import internal_context_processor

# Create your views here.
@check_permissions([
    f'{INTERNAL_APP_NAME}.{USER_CLASS}',
    f'{AQUARIUS_APP_NAME}.{USER_CLASS}'])
def aquarius_view(request, *args, **kwargs):
    context = internal_context_processor(request)
    token = request.session.get("token_permission", None)
    if token:
        if TokenPermission.objects.get(token=token)\
                .has_perm(f"{AQUARIUS_APP_NAME}.{EDIT_USER_CLASS}"):
            context["permission_edit"] = True
    if "permission_edit" not in context:
        context["permission_edit"] = request.user.has_perm(f'{AQUARIUS_APP_NAME}.{EDIT_USER_CLASS}')
    return render(request, "internal/aquarius/aquarius.html", context)
