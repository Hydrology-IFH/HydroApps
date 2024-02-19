from django.apps import AppConfig
from datetime import datetime, timedelta, date, time, timezone

class MyAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'my_auth'

    def ready(self):
        # create the my_auth schedules
        from django_q.tasks import schedule
        from django_q.models import Schedule
        from django.db.utils import ProgrammingError

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
            # update or create the schedule
            if sched_ex := Schedule.objects.filter(name=options["name"]):
                sched_ex.update(**options)
            else:
                schedule(**options)
        except ProgrammingError: # if the database is not ready yet
            pass