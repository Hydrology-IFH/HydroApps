from django.core.cache import cache

from my_auth.config import USER_CLASS
from my_auth.models import TokenPermission
from .aquarius.config import AQUARIUS_APP_NAME
from .config import APP_NAME as INTERNAL_APP_NAME

def internal_context_processor(request):
    # create the cache key with all relevant information
    user_id = request.user.id if request.user.is_authenticated else 'anon'
    token = request.GET.get("token", request.session.get("token_permission", None))
    cache_key = f"internal_context_{user_id}_{token}"

    # get and return cache value if exists
    cache_value = cache.get(cache_key)
    if cache_value is not None:
        return cache_value

    # compute the context value
    context = {
        "internal_app_permissions": []
    }
    for app_name, perm_name in [("aquarius", f'{AQUARIUS_APP_NAME}.{USER_CLASS}'),
                                ("home", f'{INTERNAL_APP_NAME}.{USER_CLASS}')]:
        if request.user.has_perm(perm_name):
            context["internal_app_permissions"].append(app_name)
        else:
            if token is not None:
                if TokenPermission.objects.get(token=token).has_perm(perm_name):
                    context["internal_app_permissions"].append(app_name)

    # set the computed value in cache
    cache.set(cache_key, context, 300)  # Cache for 5 minutes

    return context