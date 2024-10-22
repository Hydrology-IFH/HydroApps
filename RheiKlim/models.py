from django.contrib.gis.db import models
from django.db.models.base import ModelBase

class MetaN(models.Model):
    stat_id = models.IntegerField(unique=True, primary_key=True)
    geometry = models.PointField(srid=4326, blank=True, null=True)
    source = models.TextField(blank=True, null=True)
    operator = models.TextField(blank=True, null=True)
    cn = models.TextField(blank=True, null=True)
    # geometry_utm = models.PointField(srid=25832, blank=True, null=True)
    hoehe = models.IntegerField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'rheiklim_station_meta'