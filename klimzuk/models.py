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
        db_table = 'klimzuk_station_meta'

# def get_ts_model(stat_id):
#     db_table = f"ts_{stat_id}"
#     class TSMeta(ModelBase):
#         def __new__(cls, name, bases, attrs):
#             # name += db_table
#             model = super(TSMeta, cls).__new__(cls, name, bases, attrs)
#             model.managed = False
#             model._meta.db_table = db_table
#             return model
#             # return models.base.ModelBase.__new__(cls, name, bases, attrs)

#     class TSBase(models.Model, metaclass=TSMeta):
#         using = 'klimzuk_ts'
#         date = models.IntegerField(unique=True, primary_key=True, null=False)
#         pr_min = models.FloatField()
#         pr_max = models.FloatField()
#         pr_mean = models.FloatField()
#         tas_min = models.FloatField()
#         tas_max = models.FloatField()
#         tas_mean = models.FloatField()

#         # class Meta:
#         #     managed = False
#         #     db_table = db_table
#     return TSBase