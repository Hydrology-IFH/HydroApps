from rest_framework import serializers

from .. models import Location

class LocationListSerializer(serializers.ModelSerializer):
    """
    Serializer for AquariusLocations model.
    Converts model instances to JSON format and vice versa.
    """

    class Meta:
        model = Location
        fields = [
            "uniqueId",
            "identifier",
            "name",
            "tags",
            "primaryFolder",
            'geometry'
        ]

    def to_representation(self, instance):
        """
        Convert model instance to JSON representation.
        """
        representation = super().to_representation(instance)
        representation['tags'] = [tag.key for tag in instance.tags.all()]
        representation['primaryFolder'] = instance.primaryFolder.get_folder_list()
        return representation

    def create(self, validated_data):
        """
        Create a new AquariusLocations instance.
        """
        tags_data = validated_data.pop('tags', [])
        location = super().create(validated_data)
        for tag in tags_data:
            location.tags.add(tag)
        return location