from .settings import *

# Change database settings for testing as django doesnt change those
for db in DATABASES.keys():
    for para in ["HOST", "USER", "PORT", "PASSWORD"]:
        if "TEST" in DATABASES[db] and para in DATABASES[db]["TEST"]:
            DATABASES[db][para] = DATABASES[db]["TEST"][para]