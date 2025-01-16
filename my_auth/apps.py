from django.apps import AppConfig
from datetime import datetime, timedelta, date, time, timezone
import warnings
from django.db.utils import ProgrammingError
from django.db import connection

class MyAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'my_auth'
    run_already = False

    def ready(self):
        if not self.run_already:
            self.run_already = True
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=RuntimeWarning)
                db_tables = connection.introspection.table_names()

                # create the my_auth schedules
                from django_q.tasks import schedule
                from django_q.models import Schedule
                if Schedule._meta.db_table in db_tables:

                    today = date.today()
                    options = dict(
                        name="my_auth: Check Accounts",
                        func="my_auth.models.Account.check_accounts",
                        schedule_type=Schedule.WEEKLY,
                        repeats=-1,
                        next_run=datetime.combine(
                            today + timedelta(days=7-today.isoweekday()),
                            time(2, 32),
                            timezone.utc)
                    )

                    try:
                        if sched_ex := Schedule.objects.filter(name=options["name"]):
                            sched_ex.update(**options)
                        else:
                            schedule(**options)
                    except ProgrammingError: # if the database is not ready yet
                        pass

                # setup test Permissions for all the apps
                from .models import PermissionClass, Permission
                from HydroApps.models import App
                if PermissionClass._meta.db_table in db_tables:
                    test_class, _ = PermissionClass.objects.get_or_create(
                        name="Test-User",
                        description="Gives User test access to a specific app defined in the my_auth.Permission")
                    if Permission._meta.db_table in db_tables and App._meta.db_table in db_tables:
                        for app in App.objects.all():
                            Permission.objects.get_or_create(
                                app=app,
                                permission_class=test_class)

