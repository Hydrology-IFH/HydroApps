from main.base_sitemap import BaseSitemap

class WeatherDBSitemap(BaseSitemap):
    namespace = "weatherDB"

    def items(self):
        return ['home', "get_ts", "method", "package"]