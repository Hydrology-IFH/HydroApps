from django.shortcuts import render

from .context_processors import get_show_unreleased_app

def unreleased(view_func):
    """
    Decorator for views that checks that the user is logged in, redirecting
    to the log-in page if necessary.
    """
    def decorator(request, *args, **kwargs):
        if get_show_unreleased_app(request):
            return view_func(request, *args, **kwargs)
        else:
            return render(request, "unreleased.html", {})
    return decorator