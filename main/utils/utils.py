from ..settings import DEBUG

def get_active_app(request):
    first_url_part = request.META["PATH_INFO"].split("/")[1]
    if first_url_part in ("weather", "weatherDB", "weatherdb"):
        return "weatherDB"
    elif first_url_part == "asgII":
        return "asgII"
    elif first_url_part == "kombstra":
        return "kombstra"
    elif first_url_part == "sri-bw":
        return "sri-bw"
    else:
        return "HydroApps"

def get_base_template(request):
    active_app = get_active_app(request)
    return f"{active_app}/base.html"

def check_show_release(request):
    return DEBUG or (request.user.is_authenticated and request.user.is_tester)

def get_context_base(request, **kwargs):
    return {"debug": DEBUG,
            "app_unreleased": request.app_unreleased if hasattr(request, "app_unreleased") else False,
            "show_unreleased": check_show_release(request)}

def get_context_extra(request, **kwargs):
    context = get_context_base(request, **kwargs)

    # get active_app
    if "app_name" in kwargs:
        app_name = kwargs["app_name"]
    else:
        app_name = get_active_app(request)
    context.update({
        "base_template": f"{app_name}/base.html",
        "active_app": app_name})

    return context