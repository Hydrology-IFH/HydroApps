from main.base_sitemap import BaseSitemap

class KombStRASitemap(BaseSitemap):
    namespace = "kombstra"

    def items(self):
        return ['home', "map", "method"]