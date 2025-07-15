from rest_framework import viewsets, routers
from django.contrib.gis.geos import Point
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import permissions

from ..models import Location
from .serializers import LocationListSerializer
from .permissions import ReadPermission
from ..config import API_CACHE_DURATION, API_CACHE_PREFIX

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Locations with filtering based on validity.

    Query parameters:
    - filter: 'all' (default), 'valid', 'invalid'
    """
    serializer_class = LocationListSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        ReadPermission
    ]
    view_name = 'locations'

    @method_decorator(cache_page(API_CACHE_DURATION, key_prefix=API_CACHE_PREFIX))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_queryset(self):
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


# Create a router and register the viewset
router = routers.DefaultRouter()
router.register(r'locations', LocationViewSet, basename='locations')