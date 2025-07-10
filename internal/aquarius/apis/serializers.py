from .. models import Locations

class LocationsSerializer:
    """
    Serializer for AquariusLocations model.
    Converts model instances to JSON format and vice versa.
    """

    class Meta:
        model = Locations
        fields = '__all__'  # Include all fields from the model

    def to_representation(self, instance):
        """
        Convert model instance to JSON representation.
        """
        representation = super().to_representation(instance)
        representation['tags'] = [tag.name for tag in instance.tags.all()]
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