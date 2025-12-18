from django.apps import AppConfig
import warnings
from django.db import connection
from .aquarius.apps import InternalAquariusConfig
from .config import APP_NAME
from my_auth.config import USER_CLASS

class InternalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'internal'
    run_already = False
    sub_configs = [InternalAquariusConfig()]

    def ready(self):
        # Call ready methods of sub-configs
        for sub_config in self.sub_configs:
            sub_config.ready()

        # create internal permission class
        if not self.run_already:
            self.run_already = True
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=RuntimeWarning)
                db_tables = connection.introspection.table_names()

                # setup editor Permission for Internal usage the apps
                from my_auth.models import PermissionClass, Permission
                from HydroApps.models import App

                if PermissionClass._meta.db_table in db_tables and \
                        Permission._meta.db_table in db_tables and \
                        App._meta.db_table in db_tables:
                    permission_class_user = PermissionClass.objects.get(
                        name=USER_CLASS)
                    internal_app = App.objects.get(
                        name=APP_NAME)
                    internal_app.description = "Hydro-Apps for internal usage"
                    internal_app.save()
                    Permission.objects.update_or_create(
                        app=internal_app,
                        permission_class=permission_class_user)