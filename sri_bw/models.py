from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _


class SRIBWPolygons(models.Model):
    grid_id = models.IntegerField(unique=True, primary_key=True)
    geometry = models.PolygonField(srid=3857, blank=True, null=True)

    class Meta:
        db_table = 'sri_bw_polygons'

class SRIBWData(models.Model):
    data_id = models.BigAutoField(
        primary_key=True,
        help_text=_("ID of the event"))
    grid_id = models.ForeignKey(
        SRIBWPolygons,
        models.DO_NOTHING,
        blank=False, null=False,
        help_text=_("ID to link to the Grid-Cell"),
        db_column='grid_id')
    duration = models.IntegerField(
        blank=False, null=False,
        help_text=_("Duration class of the event (Dauerstufe) in minutes"))
    pval = models.FloatField(
        blank=False, null=False,
        help_text=_("Precipitation amount of the event in mm"))
    pint = models.FloatField(
        blank=False, null=False,
        help_text=_("Precipitation intensity of the event in mm/h"))
    sri = models.IntegerField(
        blank=False, null=False,
        help_text=_("Starkregen-Index (SRI) of the event"))
    date = models.DateField(
        blank=False, null=False,
        help_text=_("Date of the event"))
    event_rank = models.IntegerField(
        blank=False, null=False,
        help_text=_("Rank of the event in the grid-cell"))

    class Meta:
        db_table = 'sri_bw_data'
        unique_together = (('grid_id', 'event_rank'),)

class SRIBWDataSpans(models.Model):
    id = models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    max_year = models.IntegerField(help_text="Maximum year of events")
    min_year = models.IntegerField(help_text="Minimum year of events")
    max_rank = models.IntegerField(help_text="Maximum rank of events")
    max_nevents = models.JSONField(help_text="Maximum number of events per SRI")

    class Meta:
        db_table = 'sri_bw_data_spans'
        managed = False
        db_table_comment = "View for the spans of the data"
