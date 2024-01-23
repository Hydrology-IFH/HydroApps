from django.shortcuts import render
from .utils.utils import get_context_extra
from django.conf import settings

def impressum_view(request, *args, **kwargs):
    return render(request, "impressum.html", get_context_extra(request, **kwargs))

def datenschutz_view(request, *args, **kwargs):
    return render(request, "datenschutz.html", get_context_extra(request, **kwargs))

def google_site_verification_view(request):
    google_site_ver = getattr(settings, "GOOGLE_SITE_VERIFICATION_FILE", None)
    context = {
        'google_site_ver': google_site_ver
    }
    return render(
        request, 'google_verification.html',
        context, content_type='text/html'
    )