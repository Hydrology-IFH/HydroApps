from django.contrib.gis.gdal import SpatialReference
from pathlib import Path

with open(Path(__file__).parent / "radolan.prj", "r") as f:
    radolan_crs = SpatialReference(f.read(), srs_type="wkt")