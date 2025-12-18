from my_auth.config import USER_CLASS
from .aquarius.config import AQUARIUS_APP_NAME

def internal_context_processor(request):
    context = {
        "app_permissions": []
    }
    if request.user.has_perm(f'{AQUARIUS_APP_NAME}.{USER_CLASS}'):
        context["app_permissions"].append("aquarius")

    return context