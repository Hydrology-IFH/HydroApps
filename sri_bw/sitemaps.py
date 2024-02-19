from main.base_sitemap import BaseSitemap

class SRIBWSitemap(BaseSitemap):
    namespace = "SRI-BW"

    def items(self):
        return ['home', "map", "method"]