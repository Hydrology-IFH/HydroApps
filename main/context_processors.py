from .settings import DEBUG, APPS_UNRELEASED, APPS_ALT_NAMES
from my_auth.models import TokenPermission

def get_active_app(request):
    path_parts = request.META["PATH_INFO"].split("/")
    first_url_part = path_parts[2] if path_parts[1] in ("de", "en") else path_parts[1]

    return APPS_ALT_NAMES.get(first_url_part, "HydroApps")

def get_show_unreleased_app(request, active_app=None):
    if active_app is None:
        active_app = get_active_app(request)
    if (request.user.is_authenticated and
        request.user.permissions\
            .filter(
                app__name=active_app,
                permission_class__name="Test-User")\
            .exists()):
        return True
    if ("token" in request.GET and
        (qs_permission := TokenPermission.objects.filter(token=request.GET["token"])).exists()):
        request.session["token_permission"] = qs_permission.first().pk
        return qs_permission.filter(permissions__app__name=active_app,
                                    permissions__permission_class__name="Test-User")\
                            .exists()
    if "token_permission" in request.session:
        return TokenPermission.objects\
            .filter(token=request.session["token_permission"])\
            .filter(permissions__app__name=active_app,
                    permissions__permission_class__name="Test-User")\
            .exists()
    return False


def get_dict_show_unreleased_apps(request):
    return {app: get_show_unreleased_app(request, app) for app in set(APPS_ALT_NAMES.values())}


def default_context(request):
    context = {
        "debug": DEBUG,
        "active_app": get_active_app(request),
    }
    context["base_template"] = f"{context['active_app']}/base.html"
    context["app_unreleased"] = context['active_app'] in APPS_UNRELEASED
    context["show_unreleased_apps"] = get_dict_show_unreleased_apps(request)

    return context