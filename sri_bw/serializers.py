from rest_framework import serializers
from .models import SRIBWData, SRIBWPolygons


class SRIBWDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SRIBWData
        fields = ["event_rank", "date", "duration", "pval", "pint", "sri"]

class SRIBWPolygonsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SRIBWPolygons
        fields = '__all__'