from main.base_sitemap import BaseSitemap

class RheiKlimSitemap(BaseSitemap):
    namespace = "RheiKlim"

    def items(self):
        return ['home', "map", "method"]