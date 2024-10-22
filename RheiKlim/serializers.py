from rest_framework import serializers

class TSSerializer(serializers.Serializer):
    date = serializers.IntegerField()
    pr_min = serializers.FloatField()
    pr_max = serializers.FloatField()
    pr_mean = serializers.FloatField()
    tas_min = serializers.FloatField()
    tas_max = serializers.FloatField()
    tas_mean = serializers.FloatField()