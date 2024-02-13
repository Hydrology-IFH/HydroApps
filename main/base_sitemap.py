from django.contrib import sitemaps
from django.urls import reverse

class BaseSitemap(sitemaps.Sitemap):
    priority = 0.5
    changefreq = 'monthly'
    i18n = True
    languages = ['de', 'en']
    namespace = None
    loc_kwargs = {}

    def location(self, item):
        if self.namespace:
            return reverse(f"{self.namespace}:{item}", kwargs=self.loc_kwargs)
        return reverse(item, kwargs=self.loc_kwargs)
