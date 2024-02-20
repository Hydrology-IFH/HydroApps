import os
import subprocess

from django.core.management.commands.makemessages import (
    Command as MakeMessagesCommand
)
from main.settings import BASE_DIR


class Command(MakeMessagesCommand):
    """This command also runs the node i18n command when makemessages is called."""

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            "--nonode",
            dest="nonode",
            action="store_true",
            help="Don't run the node i18n command.",
        )

    def handle(self, **options):
        # """Run the server with node i18n."""
        if not options["nonode"]:
            self.stdout.write("starting node i18n command.")
            subprocess.run(
                "npm run i18n",
                cwd=os.path.join(BASE_DIR, "front-end"),
                shell=True)
        return super(Command, self).handle(**options)