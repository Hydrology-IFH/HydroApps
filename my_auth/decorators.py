from django.shortcuts import render
from django.shortcuts import redirect
from django.urls import reverse

from main.context_processors import get_active_app

def check_permissions(permission_names:list):
    """
    Decorator for views that checks that the user has the given permission,
    redirecting to the log-in page if necessary.
    """
    def wrapper(view_func):
        def decorator(request, *args, **kwargs):
            if request.user.is_authenticated:
                if request.user.has_perms(permission_names):
                    return view_func(request, *args, **kwargs)
                else:
                    return render(request, "missing-permissions.html", {})
            else:
                return redirect(
                    reverse(
                        "login",
                        kwargs=dict(app_name=get_active_app(request))
                    ) +"?restricted_content_redirect"
                )
        return decorator
    return wrapper