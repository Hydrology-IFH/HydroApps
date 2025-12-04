from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """This command updates the HydroApps database with data from Aquarius."""
    help = "Update the internal HydroApps database with data from Aquarius."

    def handle(self, **options):
        # """Run the server with node i18n."""
        from internal.aquarius.tasks import update_aquarius_data
        update_aquarius_data()