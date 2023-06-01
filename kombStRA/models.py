from django.contrib.gis.db import models

class KombStRAGrid(models.Model):
    grid_id = models.IntegerField(unique=True, primary_key=True)
    geometry = models.PolygonField(srid=4326, blank=True, null=True)

    class Meta:
        db_table = 'KombStRA_grid'