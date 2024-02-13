from main.base_sitemap import BaseSitemap

class HydroAppsSitemap(BaseSitemap):
    namespace = "HydroApps"

    def items(self):
        return ['home']