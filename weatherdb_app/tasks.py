from weatherdb.broker import Broker
from .models import TSDownloads, CacheHCaptchaTest

def regular_update(*args, **kwargs): # now done in crontab on fuhys011
    Broker().update_db(*args, **kwargs)
    TSDownloads.clean_files(max_days=0)

def cleanup_cache(*args, **kwargs):
    TSDownloads.clean_files()
    CacheHCaptchaTest.clean()