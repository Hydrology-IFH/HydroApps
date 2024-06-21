from main.tests.baseTests import BaseTestCase

############################################
# Model tests
############################################


############################################
# View tests
############################################

class Base:
    class NoLoginViews(BaseTestCase.UnreleasedViews):
        sfi_mockup = "sfi_mockup"

# Test cases for views
class TestHomeView(Base.NoLoginViews):
    url_name = 'home'
    url_prefix = "sfi_mockup/"
    template = 'sfi_mockup/home.html'

class TestMethodView(Base.NoLoginViews):
    url_name = 'method'
    url_prefix = "sfi_mockup/method"
    template = 'sfi_mockup/method.html'

class TestGetTSView(Base.NoLoginViews):
    url_name = 'map'
    url_prefix = "sfi_mockup/map"
    template = 'sfi_mockup/map.html'
