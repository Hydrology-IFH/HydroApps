from rest_framework import viewsets, routers
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt
import logging

from ..models import Location
from .serializers import LocationGeoJSONSerializer
from .permissions import EditPermission, ReadPermission
from ..config import API_CACHE_DURATION, API_CACHE_PREFIX
from ..tasks import update_aquarius_data
from .decorators import check_aquarius_permission

logger = logging.getLogger(__name__)

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Locations with filtering based on validity.

    Query parameters:
    - filter: 'all' (default), 'valid', 'invalid'
    - locationIdentifier: specific location identifier to filter by
    """
    serializer_class = LocationGeoJSONSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        ReadPermission
    ]
    view_name = 'locations'
    lookup_field = 'identifier'
    http_method_names = ['get', 'patch']

    @method_decorator(csrf_exempt)
    @method_decorator(cache_page(API_CACHE_DURATION, key_prefix=API_CACHE_PREFIX))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
        if 'LocationIdentifier' in self.request.query_params:
            location_identifier = self.request.query_params['LocationIdentifier']
            return Location.objects.filter(identifier=location_identifier)

        filter_type = self.request.query_params.get('filter', 'all')

        if filter_type == 'all':
            return Location.objects.all()
        else:
            filter_invalid = (
                Q(geometry__isnull=True) |
                Q(geometry=Point(0, 0, srid=4326)))
        if filter_type == 'invalid':
            return Location.objects.filter(filter_invalid)
        elif filter_type == 'valid':
            return Location.objects.filter(~filter_invalid)

    @method_decorator(check_aquarius_permission(EditPermission()))
    def patch(self, request, identifier, *args, **kwargs):
        """
        Trigger location update from Aquarius for a specific location.
        """
        logger.debug(f"Updating location {identifier} from Aquarius...")
        update_aquarius_data(location_identifier=identifier)
        return Response(
            {"status": "Location data updated from Aquarius"},
            status=200)

# Create a router and register the viewset
router = routers.DefaultRouter()
router.register(
    'locations',
    LocationViewSet,
    basename='locations')