from django.test import TestCase
from django.urls import reverse
from my_auth.models import Account
from my_auth.models import Permission, PermissionClass

# Base test case classes for views
class BaseTestCase:
    class NoLoginViews(TestCase):
        url_name = '' # e.g. "home"
        url_prefix = "" # e.g. "weatherdb"
        app_name = "" # e.g. "weatherdb"
        template = '' # e.g. "weatherdb/home.html"

        def setUp(self):
            self.url = f'/de/{self.url_prefix}'
            self.url_name = f'{self.app_name}:{self.url_name}'

        def test_view_url_exists_at_desired_location(self):
            resp = self.client.get(self.url)
            self.assertEqual(
                resp.status_code, 200,
                msg=f"View not accessible at desired url: {self.url}")

        def test_view_url_accessible_by_name(self):
            resp = self.client.get(reverse(
                self.url_name))
            self.assertEqual(
                resp.status_code, 200,
                msg=f"View not accessible by name: {self.url_name}")

        def test_view_uses_correct_template(self):
            resp = self.client.get(reverse(
                    self.url_name))
            self.assertTemplateUsed(
                resp, self.template,
                msg_prefix=f"View ({self.app_name}:{self.url_name}) does not use correct template: {self.template}")
            self.assertTemplateUsed(
                resp, f'{self.app_name}/base.html',
                msg_prefix=f"View ({self.app_name}:{self.url_name}) does not use correct base template: {self.app_name}/base.html")

    class LoggedInViews(NoLoginViews):
        databases = ['default', 'weatherdb']

        def setUp(self):
            super().setUp()
            self.account = Account.objects.create_user(
                username='testuser',
                first_name="Test",
                last_name="User",
                email="test@test.de",
                password='testpassword',
                confirmed_data_policy=True,
                is_active=True)
            self.client.login(username='testuser', password='testpassword')

    class UnreleasedViews(LoggedInViews):
        def setUp(self):
            super().setUp()
            test_permission_class, _ = PermissionClass.objects.get_or_create(
                name="Test-User")
            test_permission = Permission.objects.get_or_create(
                app=self.app_name,
                permission_class=test_permission_class)
            self.account.permissions.add(test_permission)
            self.account.save()

