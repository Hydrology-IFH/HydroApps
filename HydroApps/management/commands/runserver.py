import os
import subprocess

from django.contrib.staticfiles.management.commands.runserver import (
    Command as RunserverCommand,
)
from django.utils.autoreload import DJANGO_AUTORELOAD_ENV

from main.settings import BASE_DIR


class Command(RunserverCommand):
    """This command removes the need for two terminal windows when running runserver."""

    help = (
        "Starts the django runserver instance and the node development server in different threads."
    )

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            "--node-dev",
            dest="node-dev",
            action="store_true",
            help="Also start the node development server in front-end directory.",
        )

    def run(self, **options):
        # """Run the server with node development in the background."""
        if os.environ.get(DJANGO_AUTORELOAD_ENV) != "true":
            self.stdout.write("Starting node dev thread.")
            if options["node-dev"]:
                self.node_proc = subprocess.Popen("npm run dev", cwd=os.path.join(BASE_DIR, "front-end"), shell=True)
        super(Command, self).run(**options)