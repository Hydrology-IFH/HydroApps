from ..settings import DEBUG

def get_base_template(request):
    first_url_part = request.META["PATH_INFO"].split("/")[1]
    if first_url_part in ("weather", "weatherDB", "weatherdb"):
        return "weatherDB/base.html"
    elif first_url_part == "klimzuk":
        return "klimzuk/base.html"
    else:
        return "HydroApps/base.html"
    
def check_show_release(request):
    return DEBUG or (request.user.is_authenticated and request.user.is_tester)

def get_context_base(request, **kwargs):
    return {"debug": DEBUG,
            "show_unreleased": check_show_release(request)}

def get_context_extra(request, **kwargs):
    context = get_context_base(request, **kwargs)

    # get active_app
    if "app_name" in kwargs:
        app_name = kwargs["app_name"]
    else:
        first_url_part = request.META["PATH_INFO"].split("/")[1]
        if first_url_part in ("weather", "weatherDB", "weatherdb"):
            app_name = "weatherDB"
        elif first_url_part == "klimzuk":
            app_name = "klimzuk"
        else:
            app_name = "HydroApps"
    context.update({
        "base_template": f"{app_name}/base.html",
        "active_app": app_name})

    return context