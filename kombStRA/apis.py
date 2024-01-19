from rest_framework import viewsets
from rest_framework import generics

from .serializers import (KombStRADataSerializer,
                          KombStRAPolygonsSerializer)
from .models import (KombStRAData,KombStRAPolygons)
from django_filters import rest_framework as filters
from django.contrib.gis.geos import Point

class KombStRAPolygonsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KombStRAPolygons.objects.all()
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
                    srid=4326))
        elif "geometry" in self.request.GET:
            return KombStRAPolygons.objects.filter(
                geometry__contains=self.request.GET["geometry"])
        else:
            return None

class KombStRADataViewSet(generics.ListAPIView, viewsets.GenericViewSet):
    queryset = KombStRAData.objects.all()
    serializer_class = KombStRADataSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['percentile', 'event_rank', "grid_id"]

class KombStRADataAllViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KombStRAData.objects.all()
    serializer_class = KombStRADataSerializer

    def get_queryset(self, *args, **kwargs):
        if "grid_id" in self.request.GET:
            return KombStRAData.objects.filter(
                grid_id=self.request.GET["grid_id"])
        else:
            return None