# Generated by Django 5.0.2 on 2024-03-26 12:59
# changed by Max

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sri_bw', '0002_rename_sri_id_to_grid_id'),
    ]

    operations = [
        migrations.RunSQL("""
            CREATE MATERIALIZED VIEW sri_bw_sri_max_events AS (
                SELECT sri, max(nevents) as max_events
                FROM (
                    SELECT grid_id, sri, sum((max_sri>=sri)::int) AS nevents
                    FROM (
                        SELECT grid_id, max(sri) AS max_sri
                        FROM sri_bw_data
                        GROUP BY grid_id, date)
                    LEFT JOIN (SELECT generate_series(0,12) AS sri) ON TRUE
                    GROUP BY grid_id, sri)
                GROUP BY sri ORDER BY sri);
            CREATE OR REPLACE FUNCTION tg_sri_bw_sri_max_events_refresh()
                RETURNS trigger LANGUAGE plpgsql AS $$
                BEGIN
                    REFRESH MATERIALIZED VIEW sri_bw_sri_max_events;
                    RETURN NULL;
                END;
                $$;
            CREATE TRIGGER tg_sri_bw_sri_max_events_refresh
            AFTER INSERT OR UPDATE OR DELETE ON sri_bw_data
            FOR EACH STATEMENT EXECUTE PROCEDURE tg_sri_bw_sri_max_events_refresh();""",
            """DROP MATERIALIZED VIEW sri_bw_sri_max_events;
            DROP TRIGGER tg_sri_bw_sri_max_events_refresh ON sri_bw_data;
            DROP FUNCTION tg_sri_bw_sri_max_events_refresh;""",
            state_operations=[
                migrations.CreateModel(
                    name='SRIBWSRIMaxEvents',
                    fields=[
                        ('sri', models.IntegerField(primary_key=True, serialize=False)),
                        ('max_events', models.IntegerField()),
                    ],
                    options={
                        'db_table': 'sri_bw_sri_max_events',
                        'managed': False,
                    },
                ),
            ]
        ),
        migrations.AlterModelTableComment(
            name='SRIBWSRIMaxEvents',
            table_comment='View for the maximum number of events per SRI',
        )
    ]
