from weatherDB_manager.classes.weatherDB.broker import Broker
from weatherDB_manager.models import TSDownloads, CacheHCaptchaTest

def regular_update(*args, **kwargs):
    Broker().update_db(*args, **kwargs)
    TSDownloads.clean_files(max_days=0)

def cleanup_cache(*args, **kwargs):
    TSDownloads.clean_files()
    CacheHCaptchaTest.clean()

## call from shell
##################
# from django_q.tasks import schedule
# import datetime
# today = datetime.date.today()
# schedule('weatherDB_manager.shedule.regular_update',
#         schedule_type='D',
#         name="weatherDB update",
#         repeats=-1,
#         next_run=datetime.datetime.combine(
#             today + datetime.timedelta(days=7-today.isoweekday()),
#             datetime.datetime.min.time())
#     )
# schedule('weatherDB_manager.shedule.cleanup_cache',
#         schedule_type='D',
#         name="cleanup download cache",
#         repeats=-1,
#         next_run=datetime.datetime.combine(
#             today,
#             datetime.datetime.max.time())
#     )