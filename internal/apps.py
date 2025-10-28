from django.apps import AppConfig
from .aquarius.apps import InternalAquariusConfig

class InternalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'internal'
    run_already = False
    sub_configs = [InternalAquariusConfig()]

    def ready(self):
        for sub_config in self.sub_configs:
            sub_config.ready()

