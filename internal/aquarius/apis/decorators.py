"""
Aquarius API decorators

This module provides some decorators for the apis
- Basic authentication
- Rate limiting per user
- Permission checking
"""

import logging
from django.core.cache import cache
from django.http import JsonResponse
from functools import wraps
from django.utils import timezone

from ..config import RATE_LIMIT_PER_USER
from .permissions import ReadPermission

logger = logging.getLogger(__name__)

def check_aquarius_permission(permission=ReadPermission()):
    """
    Decorator to check if user has aquarius API permission
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Check for token permission first
            if not permission.has_permission(request):
                return JsonResponse(
                    {
                        'error': 'Permission denied',
                        'message': 'User does not have the needed permission'
                    },
                    status=403)

            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def rate_limit_user(view_func):
    """
    Decorator to implement per-user rate limiting
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        user_id = request.user.id
        cache_key = f"aquarius_rate_limit_user_{user_id}_{timezone.now().minute}"

        current_calls = cache.get(cache_key, 0)
        if current_calls >= RATE_LIMIT_PER_USER:
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'message': f'Maximum {RATE_LIMIT_PER_USER} calls per minute exceeded'
            }, status=429)

        # Increment counter with 1 minute expiry
        cache.set(cache_key, current_calls + 1, 60)
        return view_func(request, *args, **kwargs)
    return wrapper