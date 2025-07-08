from django.db import models
from django.contrib.gis.db import models as gis_models

class AquariusLocationFolder(models.Model):
    name = models.CharField(max_length=255, unique=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subfolders',
        help_text="Parent folder for hierarchical structure")

class AquariusLocationTags(models.Model):
    name = models.CharField(max_length=255, unique=True, primary_key=True)


class AquariusLocations(models.Model):
    """
    Model to store Aquarius locations.
    """
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    identifier = models.CharField(
        max_length=100,
        unique=False,
        help_text="Unique identifier for the location")
    unique_id = models.CharField(
        primary_key=True,
        max_length=52,
        unique=True,
        help_text="Unique ID for the location, e.g., UUID or similar")
    primaryFolder = models.ForeignKey(
        AquariusLocationFolder,
        on_delete=models.SET_NULL,
        related_name="folder",
        help_text="Primary folder for the location")
    lastModified = models.DateTimeField(
        help_text="Last modified timestamp")
    locationName = models.CharField(
        max_length=255,
        help_text="Name of the location")
    locationType = models.CharField(
        max_length=50,
        help_text="Type of the location")
    elevation = models.FloatField(
        help_text="Elevation of the location in meters",
        null=True,
        blank=True)
    elevationUnit = models.CharField(
        max_length=20,
        default="m",
        help_text="Unit of elevation, e.g., 'm' for meters")
    tags = models.ManyToManyField(
        AquariusLocationTags,
        blank=True,
        related_name="tags",
        help_text="Tags associated with the location")
    geometry = gis_models.PointField(
        help_text="Geographic location",
        srid=4326)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Aquarius Location"
        verbose_name_plural = "Aquarius Locations"