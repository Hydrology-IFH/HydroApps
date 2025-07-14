from django.db import models
from django.contrib.gis.db import models as gis_models

class LocationFolder(models.Model):
    name = models.CharField(max_length=255, unique=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subfolders',
        help_text="Parent folder for hierarchical structure")

    def get_folder_list(self):
        """
        Returns a list of folder names in the hierarchy.
        """
        if self.parent is None:
            return [self.name]
        return [*self.parent.get_folder_list(), self.name]

    class Meta:
        verbose_name = "Location Folder"
        verbose_name_plural = "Location Folders"
        db_table = 'internal_aquarius_location_folder'

class LocationTag(models.Model):
    uniqueId = models.CharField(
        max_length=52,
        unique=True,
        primary_key=True,
        help_text="Unique ID for the tag, e.g., UUID or similar")
    key = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name = "Location Tag"
        verbose_name_plural = "Location Tags"
        db_table = 'internal_aquarius_location_tag'

class LocationNote(models.Model):
    uniqueId = models.CharField(
        max_length=52,
        unique=True,
        primary_key=True,
        help_text="Unique ID for the note, e.g., UUID or similar")
    details = models.TextField(
        help_text="Details of the note, e.g., description or comments")
    lastModified = models.DateTimeField(
        help_text="Last modified timestamp")

    class Meta:
        verbose_name = "Location Note"
        verbose_name_plural = "Location Notes"
        db_table = 'internal_aquarius_location_note'

class Location(models.Model):
    """
    Model to store Aquarius locations.
    """
    uniqueId = models.CharField(
        primary_key=True,
        max_length=52,
        unique=True,
        help_text="Unique ID for the location, e.g., UUID or similar")
    identifier = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique identifier for the location")
    name = models.CharField(
        max_length=255,
        unique=False)
    primaryFolder = models.ForeignKey(
        LocationFolder,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="folder",
        help_text="Primary folder for the location")
    lastModified = models.DateTimeField(
        help_text="Last modified timestamp")
    type = models.CharField(
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
        LocationTag,
        blank=True,
        related_name="tags",
        help_text="Tags associated with the location")
    notes = models.ManyToManyField(
        LocationNote,
        blank=True,
        related_name="notes",
        help_text="Notes associated with the location")
    geometry = gis_models.PointField(
        help_text="Geographic location",
        srid=4326)

    def __str__(self):
        return self.identifier

    class Meta:
        verbose_name = "Aquarius Location"
        verbose_name_plural = "Aquarius Locations"
        db_table = 'internal_aquarius_location'