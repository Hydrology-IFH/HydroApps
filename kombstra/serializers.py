from rest_framework import serializers, fields
from django.contrib.gis.db import models
from .models import KombStRAData, KombStRAPolygons

# Custom DateField to format date as 'YYYY/MM/DD'
class DateField(fields.DateField):
    format = '%d/%m/%Y'

#  Serializers
class KombStRADataSerializer(serializers.ModelSerializer):
    serializer_field_mapping = serializers.ModelSerializer.serializer_field_mapping.copy()
    serializer_field_mapping.update({
        models.DateField: DateField
    })
    class Meta:
        model = KombStRAData
        fields = ["event_rank", "date", "duration", "pval", "pint", "sri"]

class KombStRAPolygonsSerializer(serializers.ModelSerializer):
    class Meta:
        model = KombStRAPolygons
        fields = '__all__'
