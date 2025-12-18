from django.apps import AppConfig
import warnings
from django.conf import settings
from django.db import connection

class MyAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'HydroApps'
    run_already = False

    def ready(self):
        if not self.run_already:
            self.run_already = True
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=RuntimeWarning)
                # setup test groups for all the apps
                from .models import App
                if App._meta.db_table in connection.introspection.table_names():
                    for app_name in set(settings.APPS_ALT_NAMES.values()):
                        app, created = App.objects.get_or_create(
                            name=app_name)
                        if created:
                            app.description = "This app is auto-created and has no description yet."
                            app.save()