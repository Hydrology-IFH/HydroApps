# Generated by Django 4.2 on 2023-11-15 15:34

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='kombstraPolygons',
            fields=[
                ('grid_id', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('geometry', django.contrib.gis.db.models.fields.PolygonField(blank=True, null=True, srid=4326)),
            ],
            options={
                'db_table': 'kombstra_polygons',
            },
        ),
        migrations.CreateModel(
            name='kombstraData',
            fields=[
                ('data_id', models.BigAutoField(help_text='ID of the event', primary_key=True, serialize=False)),
                ('duration', models.IntegerField(help_text='Duration class of the event (Dauerstufe) in minutes')),
                ('pval', models.FloatField(help_text='Precipitation amount of the event in mm')),
                ('sri', models.IntegerField(help_text='Starkregen-Index (SRI) of the event')),
                ('date', models.DateField(help_text='Date of the event')),
                ('event_rank', models.IntegerField(help_text='Rank of the event in the grid-cell')),
                ('percentile', models.IntegerField(help_text='Percentile of the event in the grid-cell')),
                ('grid_id', models.ForeignKey(db_column='grid_id', help_text='ID to link to the Grid-Cell', on_delete=django.db.models.deletion.DO_NOTHING, to='kombstra.kombstrapolygons')),
            ],
            options={
                'db_table': 'kombstra_data',
            },
        ),
        # RADOLAN SRID
        # found on https://www.spatialreference.org/ref/sr-org/7019/postgis/
        migrations.RunSQL("""
            INSERT into spatial_ref_sys (srid, auth_name, auth_srid, proj4text, srtext)
                VALUES (97019, 'sr-org', 7019, '',
                        'PROJCS["DWD (RADOLAN)",GEOGCS["RADOLAN Datum",DATUM["<custom>",SPHEROID["<custom>",6370040.0,0.0],TOWGS84[25591.76817,5069.58491,-235.15960,-2.7433219230851,0.0,0.0,0.99598248]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Stereographic_North_Pole"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",10.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Standard_Parallel_1",60.0],UNIT["Kilometer",1000.0]]')
            ON CONFLICT (srid) DO UPDATE SET
                          auth_name = EXCLUDED.auth_name,
                          auth_srid = EXCLUDED.auth_srid,
                          proj4text = EXCLUDED.proj4text,
                          srtext = EXCLUDED.srtext;""")
    ]
