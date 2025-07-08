"""
Aquarius API Adapter/Wrapper

This module provides a simple wrapper around the Aquarius API with:
- Basic authentication
- Rate limiting per user
- Permission checking
- Direct JSON response passthrough
"""

import requests
import logging
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from .decorators import check_aquarius_permission, rate_limit_user

from ..config import (AQUARIUS_API_ALLOWED_ENDPOINTS,
                     PERMISSION_CLASS_READ,
                     PERMISSION_CLASS_EDIT,
                     AQUARIUS_API_USER,
                     AQUARIUS_API_PWD,
                     AQUARIUS_API_URL)

logger = logging.getLogger(__name__)


class AquariusAPIException(Exception):
    """Custom exception for Aquarius API errors"""
    pass

class AquariusAPIAdapter:
    """
    Simple adapter for the Aquarius API using basic authentication
    """

    def __init__(self):
        self.base_url = getattr(settings, 'AQUARIUS_API_URL', AQUARIUS_API_URL)
        self.username = getattr(settings, 'AQUARIUS_API_USER', AQUARIUS_API_USER)
        self.password = getattr(settings, 'AQUARIUS_API_PWD', AQUARIUS_API_PWD)

        if not self.username or not self.password:
            raise AquariusAPIException("AQUARIUS_API_USER and AQUARIUS_API_PWD must be set in settings")

    def make_request(self, method: str, endpoint: str, **params):
        """
        Make a request to the Aquarius API and return JSON response

        Args:
            method: HTTP method (GET or POST)
            endpoint: API endpoint name
            **params: Query/form parameters for the request

        Returns:
            dict: API response data
        """
        # Validate endpoint
        if endpoint not in AQUARIUS_API_ALLOWED_ENDPOINTS:
            raise AquariusAPIException(f"Endpoint '{endpoint}' is not allowed")

        url = f"{self.base_url}/{endpoint}"

        try:
            if method.upper() == 'GET':
                response = requests.get(
                    url,
                    params=params,
                    auth=(self.username, self.password),
                    timeout=30
                )
            elif method.upper() == 'POST':
                response = requests.post(
                    url,
                    data=params,
                    auth=(self.username, self.password),
                    timeout=30
                )
            else:
                raise AquariusAPIException(f"HTTP method '{method}' not supported")

            if response.status_code >= 400:
                raise AquariusAPIException(f"API error: {response.status_code} - {response.text}")

            return response.json() if response.content else {}

        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            raise AquariusAPIException(f"Request failed: {str(e)}")


# Global adapter instance
aquarius_adapter = AquariusAPIAdapter()


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
@method_decorator(rate_limit_user, name='dispatch')
class AquariusAPIProxyView(View):
    """
    Class-based view for Aquarius API proxy that handles both GET and POST requests
    """

    def dispatch(self, request, *args, **kwargs):
        """Override dispatch to handle method-specific permission checking"""
        return super().dispatch(request, *args, **kwargs)

    @method_decorator(check_aquarius_permission(PERMISSION_CLASS_READ))
    def get(self, request, endpoint):
        """
        Handle GET requests to Aquarius API
        """
        try:
            # endpoint = request.GET.get('endpoint')

            # if not endpoint:
            #     return JsonResponse({
            #         'error': 'Missing endpoint parameter',
            #         'message': 'endpoint parameter is required',
            #         'allowed_endpoints': AQUARIUS_API_ALLOWED_ENDPOINTS
            #     }, status=400)

            # Remove endpoint from params and pass the rest to the API
            params = request.GET.copy()
            # del params['endpoint']

            # Make GET request to external API
            data = aquarius_adapter.make_request('GET', endpoint, **params.dict())

            # Return response directly from external API
            return JsonResponse(data)

        except AquariusAPIException as e:
            logger.error(f"Aquarius API error: {str(e)}")
            return JsonResponse({
                'error': 'API error',
                'message': str(e)
            }, status=400)

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({
                'error': 'Internal server error',
                'message': 'An unexpected error occurred'
            }, status=500)

    @method_decorator(check_aquarius_permission(PERMISSION_CLASS_EDIT))
    def post(self, request, endpoint):
        """
        Handle POST requests to Aquarius API
        """
        try:
            # Check for endpoint in both GET and POST data
            # endpoint = request.GET.get('endpoint') or request.POST.get('endpoint')

            # if not endpoint:
            #     return JsonResponse({
            #         'error': 'Missing endpoint parameter',
            #         'message': 'endpoint parameter is required (in GET or POST data)',
            #         'allowed_endpoints': AQUARIUS_API_ALLOWED_ENDPOINTS
            #     }, status=400)

            # Get POST data and remove endpoint if it exists there
            params = request.POST.copy()
            # if 'endpoint' in params:
            #     del params['endpoint']

            # Make POST request to external API
            data = aquarius_adapter.make_request('POST', endpoint, **params.dict())

            # Return response directly from external API
            return JsonResponse(data)

        except AquariusAPIException as e:
            logger.error(f"Aquarius API error: {str(e)}")
            return JsonResponse({
                'error': 'API error',
                'message': str(e)
            }, status=400)

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({
                'error': 'Internal server error',
                'message': 'An unexpected error occurred'
            }, status=500)
