from rest_framework import viewsets, routers

from ..models import Location
from .serializers import LocationSerializer


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Locations model.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


# Create a router and register the viewset
router = routers.DefaultRouter()
router.register(r'locations', LocationViewSet, basename='locations')