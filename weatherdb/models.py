from django.contrib.gis.db import models
import datetime
from pathlib import Path
from main.settings import CACHE_DIR, CACHE_URL


class MetaN(models.Model):
    using = 'weatherdb'
    station_id = models.IntegerField(unique=True, primary_key=True)
    is_real = models.BooleanField()
    geometry = models.PointField(srid=4326, blank=True, null=True)
    raw_from = models.DateTimeField(blank=True, null=True)
    raw_until = models.DateTimeField(blank=True, null=True)
    filled_from = models.DateTimeField(blank=True, null=True)
    filled_until = models.DateTimeField(blank=True, null=True)
    quot_corr_filled = models.FloatField(null=True, blank=True)
    quot_filled_hyras = models.FloatField(null=True, blank=True)
    richter_class = models.TextField(blank=True, null=True)
    qc_droped = models.FloatField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'meta_n'

class TSDownloads(models.Model):
    using = 'default'
    filepath = models.TextField(primary_key=True, unique=True)
    timestamp = models.DateTimeField(
        auto_now_add=True)
    user = models.CharField(max_length=100, null=True, default=None)
    ip = models.GenericIPAddressField(blank=True, null=True)
    stids = models.TextField(blank=True, null=True)
    period_start = models.DateTimeField(blank=True, null=True)
    period_end = models.DateTimeField(blank=True, null=True)
    split_date = models.BooleanField(blank=True, null=True)
    kinds = models.CharField(max_length=30, null=True)
    agg_to = models.CharField(max_length=10, null=True)
    add_na_share = models.BooleanField(blank=True, null=True)
    add_t_min = models.BooleanField(blank=True, null=True)
    add_t_max = models.BooleanField(blank=True, null=True)
    toolbox_format = models.BooleanField(blank=True, null=True)

    def delete(self):
        file = Path(self.filepath)
        if file.is_file():
            file.unlink()
        super().delete()

    @classmethod
    def create_file(cls, stids, period_start, period_end, split_date, kinds,
                    aggregation, add_na_share, add_t_min, add_t_max,
                    toolbox_format, request):
        temp_zf = CACHE_DIR.joinpath(
            "ts_produkt_" + datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d_%H%M%S")+".zip")
        # check if already existing and add number
        i=0
        while len(cls.objects.filter(filepath=temp_zf))>0:
            temp_zf = CACHE_DIR.joinpath(
                "ts_produkt_" + datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d_%H%M%S")+f"_{i}.zip")
            i+=1

        obj = cls.objects.create(
            user=request.user,
            ip=request.META['REMOTE_ADDR'],
            filepath=temp_zf,
            stids=stids,
            period_start=period_start,
            period_end=period_end,
            split_date=split_date,
            kinds=str(kinds),
            agg_to=aggregation,
            add_na_share=add_na_share,
            add_t_min=add_t_min,
            add_t_max=add_t_max,
            toolbox_format=toolbox_format
            )
        return obj

    @classmethod
    def get_cached_file(cls, stids, period_start, period_end, split_date, kinds,
                        aggregation, add_na_share, add_t_min, add_t_max, toolbox_format):
        objs = cls.objects.filter(
            stids=stids,
            period_start=period_start,
            period_end=period_end,
            split_date=split_date,
            kinds=str(kinds),
            agg_to=aggregation,
            add_na_share=add_na_share,
            add_t_min=add_t_min,
            add_t_max=add_t_max,
            toolbox_format=toolbox_format
            )
        if len(objs)>0:
            for obj in objs:
                if obj.get_fp().is_file():
                    return obj.get_url()
                else:
                    obj.delete()
            return None
        else:
            return None

    @classmethod
    def delete_file(cls, filepath):
        fileq = cls.objects.get(pk=filepath)
        fileq.delete()

    @classmethod
    def clean_files(cls, max_days=2):
        #  remove outdated files
        limit_tstp = datetime.datetime.now(datetime.timezone.utc)\
             - datetime.timedelta(days=max_days)
        old_files = cls.objects.filter(timestamp__lte=limit_tstp)
        for fileobj in old_files:
            fileobj.delete()

        # remove database entries with no corresponding file
        limit_tstp = datetime.datetime.now(datetime.timezone.utc)\
                - datetime.timedelta(minutes=2) # to be sure, that entry is not in use
        for db_entry in cls.objects.filter(timestamp__lte=limit_tstp):
            if not db_entry.get_fp().is_file():
                db_entry.delete()

    def get_url(self):
        return CACHE_URL + str(self.get_fp().name)

    def get_fp(self):
        return Path(self.filepath)

    class Meta:
        db_table = 'Cache_ts_downloads'

class CacheHCaptchaTest(models.Model):
    csrf_token = models.CharField(max_length=255, db_index=True, null=False, primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    @classmethod
    def clean(cls, max_minutes=10):
        cls.objects.filter(
            timestamp__lte=datetime.datetime.now()-datetime.timedelta(minutes=max_minutes)
            ).delete()

    class Meta:
        db_table = "Cache_HCaptcha_Test"
