# Generated by Django 4.2 on 2023-11-09 11:52

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MetaN',
            fields=[
                ('station_id', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('is_real', models.BooleanField()),
                ('geometry', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
                ('raw_from', models.DateTimeField(blank=True, null=True)),
                ('raw_until', models.DateTimeField(blank=True, null=True)),
                ('filled_from', models.DateTimeField(blank=True, null=True)),
                ('filled_until', models.DateTimeField(blank=True, null=True)),
                ('quot_corr_filled', models.FloatField(blank=True, null=True)),
                ('quot_filled_hyras', models.FloatField(blank=True, null=True)),
                ('richter_class', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'meta_n',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CacheHCaptchaTest',
            fields=[
                ('csrf_token', models.CharField(db_index=True, max_length=255, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'Cache_HCaptcha_Test',
            },
        ),
        migrations.CreateModel(
            name='TSDownloads',
            fields=[
                ('filepath', models.TextField(primary_key=True, serialize=False, unique=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.CharField(default=None, max_length=100, null=True)),
                ('ip', models.GenericIPAddressField(blank=True, null=True)),
                ('stids', models.TextField(blank=True, null=True)),
                ('period_start', models.DateTimeField(blank=True, null=True)),
                ('period_end', models.DateTimeField(blank=True, null=True)),
                ('split_date', models.BooleanField(blank=True, null=True)),
                ('kinds', models.CharField(max_length=30, null=True)),
                ('agg_to', models.CharField(max_length=10, null=True)),
                ('add_na_share', models.BooleanField(blank=True, null=True)),
                ('add_t_min', models.BooleanField(blank=True, null=True)),
                ('add_t_max', models.BooleanField(blank=True, null=True)),
                ('toolbox_format', models.BooleanField(blank=True, null=True)),
            ],
            options={
                'db_table': 'Cache_ts_downloads',
            },
        ),
    ]
