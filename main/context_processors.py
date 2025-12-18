from .settings import DEBUG, APPS_UNRELEASED, APPS_ALT_NAMES
from my_auth.models import TokenPermission
from my_auth.config import TEST_USER_CLASS

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
                permission_class__name=TEST_USER_CLASS)\
            .exists()):
        return True
    if ("token" in request.GET and
        TokenPermission.is_token_allowed_app(request.GET["token"], active_app)):
        request.session["token_permission"] = request.GET["token"]
        return True
    if "token_permission" in request.session:
        return TokenPermission.is_token_allowed_app(
            request.session["token_permission"],
            active_app)
    return False


def get_dict_show_unreleased_apps(request):
    return {app: get_show_unreleased_app(request, app) for app in set(APPS_ALT_NAMES.values())}


def default_context(request):
    active_app = get_active_app(request)
    return {
        "debug": DEBUG,
        "active_app": active_app,
        "base_template": f"{active_app}/base.html",
        "app_unreleased": active_app in APPS_UNRELEASED,
        "show_unreleased_apps": get_dict_show_unreleased_apps(request),
    }