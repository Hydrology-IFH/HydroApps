from rest_framework import viewsets
from rest_framework import generics
from .models import KombStRAData, KombStRAGrid
from .serializers import KombStRADataSerializer, KombStRAGridSerializer
from django_filters import rest_framework as filters

class KombStRAGridViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KombStRAGrid.objects.all()
    serializer_class = KombStRAGridSerializer

class KombStRADataViewSet(generics.ListAPIView, viewsets.GenericViewSet):
    queryset = KombStRAData.objects.all()
    serializer_class = KombStRADataSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['percentile', 'event_rank', "grid_id"]