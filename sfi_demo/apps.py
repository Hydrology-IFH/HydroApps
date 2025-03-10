from django.apps import AppConfig
import warnings
from django.db import connection

class MyAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sfi_demo'
    run_already = False

    def ready(self):
        if not self.run_already:
            self.run_already = True
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=RuntimeWarning)
                db_tables = connection.introspection.table_names()

                # setup test Permissions for all the apps
                from my_auth.models import PermissionClass, Permission
                from HydroApps.models import App
                if PermissionClass._meta.db_table in db_tables:
                    feedback_class, _ = PermissionClass.objects.get_or_create(
                        name="Feedback-receiver",
                        description="Adds user to the list of users to receive responses from the feedback form via email")
                    if Permission._meta.db_table in db_tables and App._meta.db_table in db_tables:
                        Permission.objects.get_or_create(
                            app=App.objects.get(name="sfi_demo"),
                            permission_class=feedback_class)

