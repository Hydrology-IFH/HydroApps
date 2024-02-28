from main.base_sitemap import BaseSitemap

class WeatherDBSitemap(BaseSitemap):
    namespace = "weatherdb"

    def items(self):
        return ['home', "get_ts", "method", "package"]