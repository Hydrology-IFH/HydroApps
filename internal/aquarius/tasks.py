from django.contrib.gis.geos import Point
import requests
from urllib.parse import urljoin
from logging import getLogger
from django.conf import settings
from django.db import connection

from .config import (
    AQUARIUS_API_URL,
    AQUARIUS_API_USER,
    AQUARIUS_API_PWD,
    API_CACHE_PREFIX
)
from .models import Location, LocationFolder, LocationTag, LocationNote

logger = getLogger(__name__)

def update_aquarius_data():
    """
    Placeholder function to update Aquarius data.
    This function should contain the logic to fetch and update data from Aquarius.
    """
    logger.info("Starting update of Aquarius data...")
    api_auth = (AQUARIUS_API_USER, AQUARIUS_API_PWD)

    # get meta locations
    meta_locations = requests.get(
        urljoin(AQUARIUS_API_URL, "GetLocationDescriptionList"),
        auth=api_auth
    )
    meta_locations.raise_for_status()

    # get additional information on each location
    any_updated = False
    for meta_location in meta_locations.json()['LocationDescriptions']:

        # check if location already exists in the database and if there was an update
        if Location.objects.filter(
                uniqueId=meta_location['UniqueId'],
                lastModified=meta_location['LastModified']).exists():
            logger.debug(f"Location {meta_location['Name']} already exists and is up to date.")
            continue
        else:
            logger.info(f"Updating location {meta_location['Name']}...")
            any_updated = True

        # get additional information on the location
        location_infos_req = requests.get(
            urljoin(AQUARIUS_API_URL, "GetLocationData"),
            params={"LocationIdentifier": meta_location['Identifier']},
            auth=api_auth
        )
        location_infos_req.raise_for_status()
        location_infos = location_infos_req.json()

        # get primary folders
        parent = None
        for name in meta_location['PrimaryFolder'].split("."):
            folder = LocationFolder.objects.get_or_create(
                name=name,
                parent=parent
                )[0]
            parent = folder

        # create or update db_entry
        db_location, _ = Location.objects.update_or_create(
            uniqueId=meta_location['UniqueId'],
            defaults=dict(
                name=meta_location['Name'],
                identifier=meta_location['Identifier'],
                primaryFolder=folder,
                lastModified=meta_location['LastModified'],
                type=location_infos['LocationType'],
                geometry=Point(
                    location_infos['Longitude'],
                    location_infos['Latitude'],
                    srid="EPSG:4326"
                ),
                elevation=location_infos.get('Elevation', None),
                elevationUnit=location_infos.get('ElevationUnit', 'm'),
            )
        )

        # setting tags and notes
        for tag in meta_location['Tags']:
            tag_obj, _ = LocationTag.objects.get_or_create(
                uniqueId=tag['UniqueId'],
                key=tag['Key']
            )
            db_location.tags.add(tag_obj)
        for note in meta_location.get('LocationNotes', []):
            note_obj, _ = LocationNote.objects.get_or_create(
                uniqueId=note['UniqueId'],
                details=note['Details'],
                lastModified=note['LastModifiedUtc']
            )
            db_location.notes.add(note_obj)

    # resetting the cache for the updated location
    if any_updated:
        logger.info("Resetting cache for location API calls.")
        with connection.cursor() as cursor:
            cursor.execute(f"""
                DELETE FROM "{settings.CACHES['default']['LOCATION']}"
                WHERE "cache_key" LIKE '%%{API_CACHE_PREFIX}%%';
            """)

# TODO: implement task as management command