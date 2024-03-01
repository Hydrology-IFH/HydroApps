from django.test.runner import DiscoverRunner
from django.conf import settings


class HydroAppsTestRunner(DiscoverRunner):

    def setup_test_environment(self, *args, **kwargs):
        # Change database settings for testing as django doesnt change those
        for db in settings.DATABASES.keys():
            for para in ["HOST", "USER", "PORT", "PASSWORD"]:
                if "TEST" in settings.DATABASES[db] and para in settings.DATABASES[db]["TEST"]:
                    settings.DATABASES[db][para] = settings.DATABASES[db]["TEST"][para]

        # change unmanaged models to managed models to be mocked
        from django.apps import apps
        self.unmanaged_models = [m for m in apps.get_models() if not m._meta.managed]
        for m in self.unmanaged_models:
            m._meta.managed = True

        super().setup_test_environment(*args, **kwargs)

    def teardown_test_environment(self, *args, **kwargs):
        super().teardown_test_environment(*args, **kwargs)

        # change managed models back to unmanaged models
        for m in self.unmanaged_models:
            m._meta.managed = False
