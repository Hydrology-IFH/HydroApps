from main.base_sitemap import BaseSitemap

class SFIMockupSitemap(BaseSitemap):
    namespace = "sfi_mockup"

    def items(self):
        return ['home', "app", "method"]