from main.base_sitemap import BaseSitemap

class AuthSitemap(BaseSitemap):
    priority = 0.1
    loc_kwargs = {"app_name": "HydroApps"}

    def items(self):
        return ['register', "login", "password_reset"]