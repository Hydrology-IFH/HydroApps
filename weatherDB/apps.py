from django.apps import AppConfig
from datetime import timedelta
from django.utils import timezone
import warnings

class MyAuthConfig(AppConfig):
    name = 'weatherDB'
    run_already = False

    def ready(self):
        if not self.run_already:
            self.run_already = True
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=RuntimeWarning)
                # create the weatherDB schedules
                from django_q.tasks import schedule
                from django_q.models import Schedule

                options = dict(
                    name="weatherDB: Cleanup Cache",
                    func="weatherDB.tasks.cleanup_cache",
                    schedule_type=Schedule.HOURLY,
                    repeats=-1,
                    next_run=timezone.now() + timedelta(minutes=5),
                )

                # update or create the schedule
                if sched_ex := Schedule.objects.filter(name=options["name"]):
                    sched_ex.update(**options)
                else:
                    schedule(**options)