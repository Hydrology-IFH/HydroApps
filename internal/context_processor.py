from my_auth.config import USER_CLASS
from my_auth.models import TokenPermission
from .aquarius.config import AQUARIUS_APP_NAME

def internal_context_processor(request):
    context = {
        "app_permissions": []
    }
    for app_name, perm_name in [("aquarius", f'{AQUARIUS_APP_NAME}.{USER_CLASS}')]:
        if request.user.has_perm(perm_name):
            context["app_permissions"].append(app_name)
        else:
            token = request.GET.get("token", request.session.get("token_permission", None))
            if token is not None:
                if TokenPermission.objects.get(token=token).has_perm(perm_name):
                    context["app_permissions"].append(app_name)
    return context