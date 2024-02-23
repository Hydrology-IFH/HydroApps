from rest_framework import viewsets
from django.contrib.gis.geos import Point

from .serializers import (SRIBWDataSerializer,
                          SRIBWPolygonsSerializer)
from .models import (SRIBWData,SRIBWPolygons)


class SRIBWPolygonsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SRIBWPolygonsSerializer

    def get_queryset(self, *args, **kwargs):
        if "grid_id" in self.request.GET:
            return SRIBWPolygons.objects.filter(
                grid_id=self.request.GET["grid_id"])
        elif ("long" in self.request.GET) and \
             ("lat" in self.request.GET):
            return SRIBWPolygons.objects.filter(
                geometry__contains=Point(
                    float(self.request.GET["long"]),
                    float(self.request.GET["lat"]),
                    srid="EPSG:3857"))
        elif "geometry" in self.request.GET:
            return SRIBWPolygons.objects.filter(
                geometry__contains=self.request.GET["geometry"])
        else:
            return None

class SRIBWDataViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SRIBWDataSerializer

    def get_queryset(self, *args, **kwargs):
        if "grid_id" in self.request.GET:
            return SRIBWData.objects.filter(
                grid_id=self.request.GET["grid_id"])
        else:
            return None