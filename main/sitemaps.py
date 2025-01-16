from .base_sitemap import BaseSitemap

from HydroApps.sitemaps import HydroAppsSitemap
from RheiKlim.sitemaps import RheiKlimSitemap
from kombstra.sitemaps import KombStRASitemap
from my_auth.sitemaps import AuthSitemap
from weatherdb_app.sitemaps import WeatherDBSitemap


class MainSitemap(BaseSitemap):
    priority = 0.1
    loc_kwargs = {"app_name": "HydroApps"}

    def items(self):
        return ['impressum', 'datenschutz']

sitemaps = {
    "main": MainSitemap,
    'HydroApps': HydroAppsSitemap,
    'RheiKlim': RheiKlimSitemap,
    # 'kombstra': KombStRASitemap,
    'my_auth': AuthSitemap,
    'WeatherDB': WeatherDBSitemap,
    'sfi_demo': 'sfi_demo.sitemaps.SFIMockupSitemap'
}