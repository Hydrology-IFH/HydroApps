from main.tests.baseTests import BaseTestCase

############################################
# Model tests
############################################


############################################
# View tests
############################################

class Base:
    class NoLoginViews(BaseTestCase.UnreleasedViews):
        app_name = "kombstra"

# Test cases for views
class TestHomeView(Base.NoLoginViews):
    url_name = 'home'
    url_prefix = "kombstra/"
    template = 'kombstra/home.html'

class TestMethodView(Base.NoLoginViews):
    url_name = 'method'
    url_prefix = "kombstra/method"
    template = 'kombstra/method.html'

class TestGetTSView(Base.NoLoginViews):
    url_name = 'map'
    url_prefix = "kombstra/map"
    template = 'kombstra/map.html'
