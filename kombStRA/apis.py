from rest_framework import viewsets
from rest_framework import generics
from .models import KombStRAData, KombStRAPolygons
from .serializers import KombStRADataSerializer, KombStRAPolygonsSerializer
from django_filters import rest_framework as filters

class KombStRAPolygonsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KombStRAPolygons.objects.all()
    serializer_class = KombStRAPolygonsSerializer

class KombStRADataViewSet(generics.ListAPIView, viewsets.GenericViewSet):
    queryset = KombStRAData.objects.all()
    serializer_class = KombStRADataSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['percentile', 'event_rank', "grid_id"]