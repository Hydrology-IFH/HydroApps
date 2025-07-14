from rest_framework import viewsets, routers

from ..models import Location
from .serializers import LocationListSerializer


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Locations model.
    """
    queryset = Location.objects.all()
    serializer_class = LocationListSerializer

class invalidLocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for invalid Locations.
    """
    queryset = Location.objects.filter(geometry__isnull=True)
    serializer_class = LocationListSerializer

# Create a router and register the viewset
router = routers.DefaultRouter()
router.register(r'locations', LocationViewSet, basename='locations')
router.register(r'invalid_locations', invalidLocationViewSet, basename='invalid_locations')