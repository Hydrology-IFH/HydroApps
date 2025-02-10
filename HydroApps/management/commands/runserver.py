import os
import subprocess

from django.contrib.staticfiles.management.commands.runserver import (
    Command as RunserverCommand,
)
from django.utils.autoreload import DJANGO_AUTORELOAD_ENV
import webbrowser

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
        parser.add_argument(
            "--open-browser",
            dest="open-browser",
            action="store_true",
            help="Open the browser after starting the servers.",
        )

    def run(self, **options):
        # Run the server with node development in the background.
        if os.environ.get(DJANGO_AUTORELOAD_ENV) != "true" and options["node-dev"]:
            self.stdout.write("Starting node dev thread.")
            self.node_proc = subprocess.Popen("npm run dev", cwd=os.path.join(BASE_DIR, "front-end"), shell=True)

        # Store the open browser option
        self._open_browser = options["open-browser"]
        self._addrport = options["addrport"]

        super(Command, self).run(**options)

    def on_bind(self, *args, **kwargs):
        # Open the browser after the server has started.
        if self._open_browser:
            print("Opening the browser")
            webbrowser.open(f"http://{self._addrport}")
            self._open_browser = False

        super(Command, self).on_bind(*args, **kwargs)