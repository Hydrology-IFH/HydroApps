# Generated by Django 5.0.2 on 2024-02-20 08:17

import django.contrib.gis.db.models.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SRIBWPolygons',
            fields=[
                ('sri_id', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('geometry', django.contrib.gis.db.models.fields.PolygonField(blank=True, null=True, srid=4326)),
            ],
            options={
                'db_table': 'sri_bw_polygons',
            },
        ),
        migrations.CreateModel(
            name='SRIBWData',
            fields=[
                ('data_id', models.BigAutoField(help_text='ID of the event', primary_key=True, serialize=False)),
                ('duration', models.IntegerField(help_text='Duration class of the event (Dauerstufe) in minutes')),
                ('pval', models.FloatField(help_text='Precipitation amount of the event in mm')),
                ('pint', models.FloatField(help_text='Precipitation intensity of the event in mm/h')),
                ('sri', models.IntegerField(help_text='Starkregen-Index (SRI) of the event')),
                ('date', models.DateField(help_text='Date of the event')),
                ('event_rank', models.IntegerField(help_text='Rank of the event in the grid-cell')),
                ('sri_id', models.ForeignKey(db_column='sri_id', help_text='ID to link to the Grid-Cell', on_delete=django.db.models.deletion.DO_NOTHING, to='sri_bw.sribwpolygons')),
            ],
            options={
                'db_table': 'sri_bw_data',
                'unique_together': {('sri_id', 'event_rank')},
            },
        ),
    ]
