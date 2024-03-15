from .settings import DEBUG, APPS_UNRELEASED, APPS_ALT_NAMES

def get_active_app(request):
    path_parts = request.META["PATH_INFO"].split("/")
    first_url_part = path_parts[2] if path_parts[1] in ("de", "en") else path_parts[1]

    return APPS_ALT_NAMES.get(first_url_part, "HydroApps")

def get_show_released(request):
    return (request.user.is_authenticated and request.user.is_tester)

def default_context(request):
    context = {
        "debug": DEBUG,
        "active_app": get_active_app(request),
    }
    context["base_template"] = f"{context['active_app']}/base.html"
    context["app_unreleased"] = context['active_app'] in APPS_UNRELEASED
    context["show_unreleased"] = get_show_released(request)

    return context