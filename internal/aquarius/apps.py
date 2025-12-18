from datetime import datetime, timedelta, timezone
import warnings
from django.db.utils import ProgrammingError
from django.db import connection

from my_auth.config import USER_CLASS, EDIT_USER_CLASS
from .config import AQUARIUS_APP_NAME

class InternalAquariusConfig:
    # This is a base class that needs to get imported in the internal app
    run_already = False

    def ready(self):
        if not self.run_already:
            self.run_already = True
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=RuntimeWarning)
                db_tables = connection.introspection.table_names()

                # create the internal schedules
                from django_q.tasks import schedule
                from django_q.models import Schedule
                if Schedule._meta.db_table in db_tables:

                    # Aquarius Data Update Schedule
                    options = dict(
                        name="internal.aquarius: Update Aquarius Data",
                        func="internal.aquarius.tasks.update_aquarius_data",
                        schedule_type=Schedule.HOURLY,
                        repeats=-1,
                        next_run=datetime.now(timezone.utc) + timedelta(minutes=1)
                    )

                    try:
                        if sched_ex := Schedule.objects.filter(name=options["name"]):
                            sched_ex.update(**options)
                        else:
                            schedule(**options)
                    except ProgrammingError: # if the database is not ready yet
                        pass

                # setup editor Permission for Internal usage the apps
                from my_auth.models import PermissionClass, Permission
                from HydroApps.models import App

                if PermissionClass._meta.db_table in db_tables and \
                        Permission._meta.db_table in db_tables and \
                        App._meta.db_table in db_tables:
                    internal_aq_app, _ = App.objects.update_or_create(
                        name=AQUARIUS_APP_NAME,
                        description="Hydro-Apps for internal usage")
                    Permission.objects.update_or_create(
                        app=internal_aq_app,
                        permission_class=PermissionClass.objects.get(name=USER_CLASS))
                    Permission.objects.update_or_create(
                        app=internal_aq_app,
                        permission_class=PermissionClass.objects.get(
                            name=EDIT_USER_CLASS))

