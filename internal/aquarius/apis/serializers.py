from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .. models import Location

class LocationGeoJSONSerializer(GeoFeatureModelSerializer):
    """
    Serializer for AquariusLocations model.
    Converts model instances to JSON format and vice versa.
    """

    class Meta:
        model = Location
        geo_field = 'geometry'
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
        representation["properties"]['tags'] = [tag.key for tag in instance.tags.all()]
        representation["properties"]['primaryFolder'] = instance.primaryFolder.get_folder_list()
        return representation