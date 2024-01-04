from rest_framework import viewsets
from rest_framework import generics

from .serializers import (KombStRADataSerializer,
                          KombStRAPolygonsSerializer,
                          KombStRAGridSerializer)
from .models import (KombStRAData,KombStRAPolygons,KombStRAGrid)
from django_filters import rest_framework as filters

class KombStRAPolygonsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KombStRAPolygons.objects.all()
    serializer_class = KombStRAPolygonsSerializer

    def get_queryset(self, *args, **kwargs):
        if "grid_id" in self.request.GET:
            return KombStRAPolygons.objects.filter(
                grid_id=self.request.GET["grid_id"])
        elif "geometry" in self.request.GET:
            return KombStRAPolygons.objects.filter(
                geometry__contains=self.request.GET["geometry"]
            )
        else:
            return None

class KombStRADataViewSet(generics.ListAPIView, viewsets.GenericViewSet):
    queryset = KombStRAData.objects.all()
    serializer_class = KombStRADataSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['percentile', 'event_rank', "grid_id"]

class KombStRAGridViewSet(generics.ListAPIView, viewsets.GenericViewSet):
    queryset = KombStRAGrid.objects.all()
    serializer_class = KombStRAGridSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['percentile', 'event_rank', "para"]