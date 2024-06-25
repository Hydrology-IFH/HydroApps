# Generated by Django 5.0.2 on 2024-03-27 10:47
# changed by Max

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kombstra', '0002_create_sri_max_events'),
    ]

    operations = [
        # remove old materialized view
        migrations.RunSQL(
            """DROP MATERIALIZED VIEW kombstra_sri_max_events;
            DROP TRIGGER tg_kombstra_sri_max_events_refresh ON kombstra_data;
            DROP FUNCTION tg_kombstra_sri_max_events_refresh;""",
            """
            CREATE MATERIALIZED VIEW kombstra_sri_max_events AS (
                SELECT sri, max(nevents) as max_events
                FROM (
                    SELECT grid_id, sri, sum((max_sri>=sri)::int) AS nevents
                    FROM (
                        SELECT grid_id, max(sri) AS max_sri
                        FROM kombstra_data
                        GROUP BY grid_id, date)
                    LEFT JOIN (SELECT generate_series(0,12) AS sri) ON TRUE
                    GROUP BY grid_id, sri)
                GROUP BY sri ORDER BY sri);
            CREATE OR REPLACE FUNCTION tg_kombstra_sri_max_events_refresh()
                RETURNS trigger LANGUAGE plpgsql AS $$
                BEGIN
                    REFRESH MATERIALIZED VIEW kombstra_sri_max_events;
                    RETURN NULL;
                END;
                $$;
            CREATE TRIGGER tg_kombstra_sri_max_events_refresh
            AFTER INSERT OR UPDATE OR DELETE ON kombstra_data
            FOR EACH STATEMENT EXECUTE PROCEDURE tg_kombstra_sri_max_events_refresh();""",
            state_operations=[
                migrations.DeleteModel(name='KombStRASRIMaxEvents')
            ]
        ),
        # create new materialized view
        migrations.RunSQL("""
            CREATE MATERIALIZED VIEW kombstra_data_spans AS (
                WITH sri_max_events AS (
                    SELECT sri, max(nevents) as max_events
                    FROM (
                        SELECT grid_id, sri, sum((max_sri>=sri)::int) AS nevents
                        FROM (
                            SELECT grid_id, max(sri) AS max_sri
                            FROM kombstra_data
                            GROUP BY grid_id, date)
                        LEFT JOIN (SELECT generate_series(0,12) AS sri) ON TRUE
                        GROUP BY grid_id, sri)
                    GROUP BY sri ORDER BY sri)
                SELECT
                    1 as id, -- dummy id
                    EXTRACT(year FROM min(date))::int AS min_year,
                    EXTRACT(YEAR FROM max(date))::int AS max_year,
                    max(event_rank)::int AS max_rank,
                    json_objectagg(sri_max_events.sri:sri_max_events.max_events)::text AS max_nevents
                FROM kombstra_data sbd
                JOIN sri_max_events ON True);
            CREATE OR REPLACE FUNCTION tg_kombstra_data_spans_refresh()
                RETURNS trigger LANGUAGE plpgsql AS $$
                BEGIN
                    REFRESH MATERIALIZED VIEW kombstra_data_spans;
                    RETURN NULL;
                END;
                $$;
            CREATE TRIGGER tg_kombstra_data_spans_refresh
            AFTER INSERT OR UPDATE OR DELETE ON kombstra_data
            FOR EACH STATEMENT EXECUTE PROCEDURE tg_kombstra_data_spans_refresh();""",
            """DROP MATERIALIZED VIEW kombstra_data_spans;
            DROP TRIGGER tg_kombstra_data_spans_refresh ON kombstra_data;
            DROP FUNCTION tg_kombstra_data_spans_refresh;""",
            state_operations=[
                migrations.CreateModel(
                    name='KombStRADataSpans',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('max_year', models.IntegerField(help_text='Maximum year of events')),
                        ('min_year', models.IntegerField(help_text='Minimum year of events')),
                        ('max_rank', models.IntegerField(help_text='Maximum rank of events')),
                        ('max_nevents', models.JSONField(help_text='Maximum number of events per SRI')),
                    ],
                    options={
                        'db_table': 'kombstra_data_spans',
                        'db_table_comment': 'View for the spans of the data',
                        'managed': False,
                    },
                )
            ]),
        migrations.AlterModelTableComment(
            name='KombStRADataSpans',
            table_comment="View for the spans of the data",
        )
    ]