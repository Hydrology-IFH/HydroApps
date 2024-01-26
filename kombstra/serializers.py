from rest_framework import serializers
from rest_framework_gis import serializers as gis_serializers
from .models import KombStRAData, KombStRAPolygons


class KombStRADataSerializer(serializers.ModelSerializer):
    class Meta:
        model = KombStRAData
        fields = '__all__'  # replace this with the fields you want to expose

class KombStRAPolygonsSerializer(serializers.ModelSerializer):
    class Meta:
        model = KombStRAPolygons
        fields = '__all__'  # replace this with the fields you want to expose