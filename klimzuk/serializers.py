from rest_framework import serializers
# from .models import get_ts_model

# def get_ts_serializer(model):
#     class TSSerializer(serializers.Serializer):
#         class Meta:
#             model = model

class TSSerializer(serializers.Serializer):
    date = serializers.IntegerField()
    pr_min = serializers.FloatField()
    pr_max = serializers.FloatField()
    pr_mean = serializers.FloatField()
    tas_min = serializers.FloatField()
    tas_max = serializers.FloatField()
    tas_mean = serializers.FloatField()