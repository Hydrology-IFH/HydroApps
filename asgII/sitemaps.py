from main.base_sitemap import BaseSitemap

class AsgIISitemap(BaseSitemap):
    namespace = "asgII"

    def items(self):
        return ['home', "map", "method"]