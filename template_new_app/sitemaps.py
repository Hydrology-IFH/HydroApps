from main.base_sitemap import BaseSitemap

class AppNameSitemap(BaseSitemap):
    namespace = "app_name"

    def items(self):
        return ['home', "app", "method"]