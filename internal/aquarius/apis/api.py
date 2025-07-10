from rest_framework import viewsets, routers

from ..models import Locations
from .serializers import LocationsSerializer


class LocationsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Locations model.
    """
    queryset = Locations.objects.all()
    serializer_class = LocationsSerializer


# Create a router and register the viewset
router = routers.DefaultRouter()
router.register(r'locations', LocationsViewSet, basename='locations')