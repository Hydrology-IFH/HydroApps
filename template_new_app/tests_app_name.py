from main.tests.baseTests import BaseTestCase

############################################
# Model tests
############################################


############################################
# View tests
############################################

class Base:
    class NoLoginViews(BaseTestCase.UnreleasedViews):
        app_name = "app_name"

# Test cases for views
class TestHomeView(Base.NoLoginViews):
    url_name = 'home'
    url_prefix = "app_name/"
    template = 'app_name/home.html'

class TestMethodView(Base.NoLoginViews):
    url_name = 'method'
    url_prefix = "app_name/method"
    template = 'app_name/method.html'

class TestGetTSView(Base.NoLoginViews):
    url_name = 'map'
    url_prefix = "app_name/map"
    template = 'app_name/map.html'
