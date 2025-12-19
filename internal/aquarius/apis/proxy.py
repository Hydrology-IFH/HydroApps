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
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from urllib.parse import urljoin, parse_qs

from .decorators import check_aquarius_permission, rate_limit_user
from ..config import (AQUARIUS_API_ALLOWED_ROUTES,
                      AQUARIUS_API_ENDPOINTS_URL,
                      AQUARIUS_USER,
                      AQUARIUS_PWD,
                      AQUARIUS_URL)
from .permissions import ReadPermission, EditPermission

logger = logging.getLogger(__name__)

class AquariusAPIException(Exception):
    """Custom exception for Aquarius API errors"""
    pass

class AquariusAPIAdapter:
    """
    Simple adapter for the Aquarius API using basic authentication
    """

    def __init__(self):
        self.auth = (AQUARIUS_USER, AQUARIUS_PWD)
        if AQUARIUS_URL is None or AQUARIUS_USER is None or AQUARIUS_PWD is None:
            raise AquariusAPIException("AQUARIUS_URL, AQUARIUS_USER and AQUARIUS_PWD must be set in settings")

    def make_request(self, method: str, endpoint: str, route: str, subroute: str, **params):
        """
        Make a request to the Aquarius API and return JSON response

        Args:
            method: HTTP method (GET or POST)
            endpoint: API endpoint name, e.g. 'publish' or 'provisioning'
            route: Specific route within the endpoint
            **params: Query/form parameters for the request

        Returns:
            dict: API response data
        """
        # Validate endpoint
        if endpoint not in AQUARIUS_API_ENDPOINTS_URL.keys():
            raise AquariusAPIException(f"Endpoint '{endpoint}' is not valid")

        # Validate route
        if route not in AQUARIUS_API_ALLOWED_ROUTES[endpoint]:
            raise AquariusAPIException(f"Route '{route}' is not allowed")

        # Construct full URL
        url = urljoin(AQUARIUS_URL,
                      AQUARIUS_API_ENDPOINTS_URL[endpoint])
        url = urljoin(url, route)
        if subroute:
            print("adding subroute:", subroute)
            url = urljoin(f"{url}/", subroute)

        # Make the request to Aquarius API
        try:
            if method.upper() == 'GET':
                requests_method = requests.get
            elif method.upper() == 'POST':
                requests_method = requests.post
            elif method.upper() == 'PUT':
                requests_method = requests.put
            else:
                raise AquariusAPIException(f"HTTP method '{method}' not supported")
            logger.debug(f"Making {method} request to {url} with params: {params}")
            request_kwargs = {}

            # Use query params for GET and JSON body for mutations to keep empty lists intact
            if method.upper() == 'GET':
                request_kwargs['params'] = params
            else:
                request_kwargs['json'] = params

            response = requests_method(
                url,
                auth=self.auth,
                timeout=30,
                **request_kwargs
            )

            if response.status_code >= 400:
                raise AquariusAPIException(f"API error: {response.status_code} - {response.text}")

            return response.json() if response.content else {}

        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            raise AquariusAPIException(f"Request failed: {str(e)}")


# Global adapter instance
aquarius_adapter = AquariusAPIAdapter()


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(rate_limit_user, name='dispatch')
class AquariusAPIProxyView(View):
    """
    Class-based view for Aquarius API proxy that handles both GET and POST requests
    """

    def dispatch(self, request, *args, **kwargs):
        """Override dispatch to handle method-specific permission checking"""
        return super().dispatch(request, *args, **kwargs)

    def make_request(self, method: str, endpoint: str, route: str, subroute=None, **params):
        try:
            # Return response directly from external API
            return JsonResponse(
                aquarius_adapter.make_request(method, endpoint, route, subroute, **params)
            )
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

    @method_decorator(check_aquarius_permission(ReadPermission()))
    def get(self, request, endpoint, route, subroute=None):
        """
        Handle GET requests to Aquarius API
        """
        return self.make_request('GET', endpoint, route, subroute, **request.GET.dict())

    @method_decorator(check_aquarius_permission(EditPermission()))
    def put(self, request, endpoint, route, subroute=None):
        """
        Handle PUT requests to Aquarius API
        """
        # Parse PUT data from request body
        try:
            if request.body:
                # Try to parse as JSON first
                put_data = json.loads(request.body)
                # Convert to dict if it's already a dict, otherwise wrap in params
                params = put_data if isinstance(put_data, dict) else {'data': put_data}
            else:
                # If no body, try to parse query string
                params = parse_qs(request.META.get('QUERY_STRING', ''))
                # Flatten the query string dict (parse_qs returns lists)
                params = {k: v[0] if len(v) == 1 else v for k, v in params.items()}
        except json.JSONDecodeError:
            # If JSON parsing fails, try to parse as query string
            params = parse_qs(request.META.get('QUERY_STRING', ''))
            params = {k: v[0] if len(v) == 1 else v for k, v in params.items()}

        return self.make_request('PUT', endpoint, route, subroute, **params)