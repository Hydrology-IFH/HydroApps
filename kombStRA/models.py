from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _

class KombStRAGrid(models.Model):
    grid_id = models.IntegerField(unique=True, primary_key=True)
    geometry = models.PolygonField(srid=4326, blank=True, null=True)

    class Meta:
        db_table = 'KombStRA_grid'

class KombStRAData(models.Model):
    grid_id = models.ForeignKey( # ID
        KombStRAGrid, 
        models.DO_NOTHING,
        blank=False, null=False,
        help_text=_("ID to link to the Grid-Cell"))
    duration = models.IntegerField( # ND
        blank=False, null=False, 
        help_text=_("Duration class of the event (Dauerstufe) in minutes"))
    pval = models.FloatField(
        blank=False, null=False,
        help_text=_("Precipitation amount of the event in mm"))
    sri = models.IntegerField(
        blank=False, null=False,
        help_text=_("Starkregen-Index (SRI) of the event"))
    date = models.DateField(
        blank=False, null=False,
        help_text=_("Date of the event"))
    event_rank = models.IntegerField( # FEvNR
        blank=False, null=False,
        help_text=_("Rank of the event in the grid-cell"))

    class Meta:
        db_table = 'KombStRA_data'