from main.tests.baseTests import BaseTestCase

############################################
# Model tests
############################################


############################################
# View tests
############################################

class Base:
    class NoLoginViews(BaseTestCase.UnreleasedViews):
        internal = "internal"

# Test cases for views
class TestHomeView(Base.NoLoginViews):
    url_name = 'home'
    url_prefix = "internal/"
    template = 'internal/home.html'
    url_name = 'map'
    url_prefix = "internal/map"
    template = 'internal/map.html'
