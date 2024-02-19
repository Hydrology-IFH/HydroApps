from django.apps import AppConfig
from datetime import timedelta
from django.utils import timezone

class MyAuthConfig(AppConfig):
    name = 'weatherDB'

    def ready(self):
        # create the my_auth schedules
        from django_q.tasks import schedule
        from django_q.models import Schedule
        from django.db.utils import ProgrammingError

        options = dict(
            name="weatherDB: Cleanup Cache",
            func="weatherDB.tasks.cleanup_cache",
            schedule_type=Schedule.HOURLY,
            repeats=-1,
            next_run=timezone.now() + timedelta(minutes=5))

        try:
            # update or create the schedule
            if sched_ex := Schedule.objects.filter(name=options["name"]):
                sched_ex.update(**options)
            else:
                schedule(**options)
        except ProgrammingError: # if the database is not ready yet
            pass