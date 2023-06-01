from django.contrib.gis.db import models
from django.db.models.base import ModelBase

class Grid(models.Model):
    grid_id = models.IntegerField(unique=True, primary_key=True)
    geometry = models.PolygonField(srid=4326, blank=True, null=True)

    class Meta:
        db_table = 'KombStRA_grid'