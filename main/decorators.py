from .utils.utils import check_show_release, get_context_extra
from django.shortcuts import render

def unreleased(view_func):
    """
    Decorator for views that checks that the user is logged in, redirecting
    to the log-in page if necessary.
    """
    def decorator(request, *args, **kwargs):
        if check_show_release(request):
            request.app_unreleased = True
            return view_func(request, *args, **kwargs)
        else:
            return render(request, "unreleased.html", get_context_extra(request))
    return decorator