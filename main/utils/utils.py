from ..settings import DEBUG

def get_base_template(request):
    first_url_part = request.META["PATH_INFO"].split("/")[1]
    if first_url_part in ("weather", "weatherDB", "weatherdb"):
        return "weatherDB\\base.html"
    elif first_url_part == "klimzuk":
        return "klimzuk\\base.html"
    else:
        return "HydroApps\\base.html"
    
def get_context(request):
    context = {"debug": DEBUG}
    
    first_url_part = request.META["PATH_INFO"].split("/")[1]
    print(first_url_part)
    print(request.META["PATH_INFO"])
    if first_url_part in ("weather", "weatherDB", "weatherdb"):
        context.update({
            "base_template":"weatherDB\\base.html",
            "active_app": "weatherDB"})
    elif first_url_part == "klimzuk":
        context.update({
            "base_template":"klimzuk\\base.html",
            "active_app": "klimzuk"})
    else:
        context.update({
            "base_template":"HydroApps\\base.html",
            # "active_app": "hydroapps"
            # "base_template": "base_main.html",
            "active_app": False
            })

    return context