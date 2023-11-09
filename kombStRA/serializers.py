from rest_framework import serializers
from .models import KombStRAData, KombStRAGrid


class KombStRADataSerializer(serializers.ModelSerializer):
    class Meta:
        model = KombStRAData
        fields = '__all__'  # replace this with the fields you want to expose

class KombStRAGridSerializer(serializers.ModelSerializer):
    class Meta:
        model = KombStRAGrid
        fields = '__all__'  # replace this with the fields you want to expose

