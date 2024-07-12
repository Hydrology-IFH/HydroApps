from main.tests.baseTests import BaseTestCase

############################################
# Model tests
############################################


############################################
# View tests
############################################

class Base:
    class NoLoginViews(BaseTestCase.UnreleasedViews):
        sfi_demo = "sfi_demo"

# Test cases for views
class TestHomeView(Base.NoLoginViews):
    url_name = 'home'
    url_prefix = "sfi_demo/"
    template = 'sfi_demo/home.html'

class TestMethodView(Base.NoLoginViews):
    url_name = 'method'
    url_prefix = "sfi_demo/method"
    template = 'sfi_demo/method.html'

class TestGetTSView(Base.NoLoginViews):
    url_name = 'app'
    url_prefix = "sfi_demo/app"
    template = 'sfi_demo/app.html'
