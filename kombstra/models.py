from typing import Any
from django.contrib.gis.db import models
import pyproj
from pathlib import Path
from django.utils.translation import gettext_lazy as _
from .lib.radolan_crs import radolan_srs
from django.db.models import Func


class KombStRAPolygons(models.Model):
    grid_id = models.IntegerField(unique=True, primary_key=True)
    geometry = models.PolygonField(srid=4326, blank=True, null=True)

    class Meta:
        db_table = 'kombstra_polygons'

class KombStRAData(models.Model):
    data_id = models.BigAutoField(
        primary_key=True,
        help_text=_("ID of the event"))
    grid_id = models.ForeignKey( # ID
        KombStRAPolygons,
        models.DO_NOTHING,
        blank=False, null=False,
        help_text=_("ID to link to the Grid-Cell"),
        db_column='grid_id')
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
    percentile = models.IntegerField(
        blank=False, null=False,
        help_text=_("Percentile of the event in the grid-cell"))

    class Meta:
        db_table = 'kombstra_data'


class KombStRAGrid(models.Model):
    rid = models.IntegerField(primary_key=True)
    rast = models.RasterField(srid=97019)

    class Meta:
        db_table = 'kombstra_grid'
