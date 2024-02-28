from main.tests.baseTests import BaseTestCase
from django.db import connections
from weatherdb.models import MetaN

############################################
# Model tests
############################################


############################################
# View tests
############################################

class Base:
    class NoLoginViews(BaseTestCase.NoLoginViews):
        app_name = "weatherdb"

# Test cases for views
class TestHomeView(Base.NoLoginViews):
    url_name = 'home'
    url_prefix = "weatherdb/"
    template = 'weatherdb/home.html'

class TestMethodView(Base.NoLoginViews):
    url_name = 'method'
    url_prefix = "weatherdb/method"
    template = 'weatherdb/method.html'

class TestGetTSView(Base.NoLoginViews):
    databases = ['default', 'weatherdb']
    url_name = 'get_ts'
    url_prefix = "weatherdb/get_ts"
    template = 'weatherdb/get_ts.html'

    def setUp(self):
        super().setUp()

    @classmethod
    def setUpTestData(cls):
        # Create the table for the unmanaged model
        with connections["weatherdb"].schema_editor() as schema_editor:
            schema_editor.create_model(MetaN)

    @classmethod
    def tearDownClass(cls):
        # Delete the table for the unmanaged model
        with connections["weatherdb"].schema_editor() as schema_editor:
            schema_editor.delete_model(MetaN)
        super().tearDownClass()
