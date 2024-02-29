from main.tests.baseTests import BaseTestCase

############################################
# View tests
############################################

# Test cases for views
class TestHomeView(BaseTestCase.NoLoginViews):
    url_name = 'home'
    url_prefix = ""
    app_name = "HydroApps"
    template = 'HydroApps/home.html'
