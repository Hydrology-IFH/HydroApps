from main.base_sitemap import BaseSitemap

class AppNameSitemap(BaseSitemap):
    namespace = "internal"

    def items(self):
        return ['home', "aquarius"]