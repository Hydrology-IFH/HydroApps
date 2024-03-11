from main.tests.baseTests import BaseTestCase

############################################
# Model tests
############################################


############################################
# View tests
############################################

class Base:
    class NoLoginViews(BaseTestCase.UnreleasedViews):
        app_name = "sri_bw"

# Test cases for views
class TestHomeView(Base.NoLoginViews):
    url_name = 'home'
    url_prefix = "sri_bw/"
    template = 'sri_bw/home.html'

class TestMethodView(Base.NoLoginViews):
    url_name = 'method'
    url_prefix = "sri_bw/method"
    template = 'sri_bw/method.html'

class TestGetTSView(Base.NoLoginViews):
    url_name = 'map'
    url_prefix = "sri_bw/map"
    template = 'sri_bw/map.html'
