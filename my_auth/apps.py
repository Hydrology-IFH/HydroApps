from django.apps import AppConfig
from datetime import datetime, timedelta, date, time, timezone
import warnings
from django.db.utils import ProgrammingError

class MyAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'my_auth'
    run_already = False

    def ready(self):
        if not self.run_already:
            self.run_already = True
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=RuntimeWarning)
                # create the my_auth schedules
                from django_q.tasks import schedule
                from django_q.models import Schedule

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