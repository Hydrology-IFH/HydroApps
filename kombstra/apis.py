from rest_framework import viewsets
from django.contrib.gis.geos import Point

from .serializers import (KombStRADataSerializer,
                          KombStRAPolygonsSerializer)
from .models import (KombStRAData,KombStRAPolygons)


class KombStRAPolygonsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = KombStRAPolygonsSerializer

    def get_queryset(self, *args, **kwargs):
        if "grid_id" in self.request.GET:
            return KombStRAPolygons.objects.filter(
                grid_id=self.request.GET["grid_id"])
        elif ("long" in self.request.GET) and \
             ("lat" in self.request.GET):
            return KombStRAPolygons.objects.filter(
                geometry__contains=Point(
                    float(self.request.GET["long"]),
                    float(self.request.GET["lat"]),
                    srid=97019))
        elif "geometry" in self.request.GET:
            return KombStRAPolygons.objects.filter(
                geometry__contains=self.request.GET["geometry"])
        else:
            return None

class KombStRADataViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = KombStRADataSerializer

    def get_queryset(self, *args, **kwargs):
        if "grid_id" in self.request.GET:
            return KombStRAData.objects.filter(
                grid_id=self.request.GET["grid_id"])
        else:
            return None