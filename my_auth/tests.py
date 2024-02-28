from django.test import TestCase
from django.db.utils import IntegrityError
from django.urls import reverse
from .models import Account
from django.conf import settings

############################################
# Model tests
############################################
class AccountModelTest(TestCase):
    databases = ['default', 'weatherdb']
    def setUp(self):
        self.account = Account.objects.create(
            username='testuser',
            password='testpassword',
            confirmed_data_policy=True)

    def test_account_creation(self):
        self.assertIsInstance(
            self.account, Account,
            msg="Account not created with coorect model")
        self.assertEqual(
            "testuser", self.account.username,
            msg="Account not created with correct username")

    def test_account_confirmed_data_policy(self):
        self.assertTrue(
            self.account.confirmed_data_policy,
            msg="Account not created with confirmed data policy")

    def test_account_creation_violates_constraint(self):
        with self.assertRaises(
                IntegrityError,
                msg="Account created without confirming the data policy"):
            Account.objects.create(
                username='testuser2',
                password='testpassword2',
                confirmed_data_policy=False)

    def test_account_is_active(self):
        self.assertFalse(self.account.is_active, msg="Account is active after creation")

############################################
# View tests
############################################

# Base test case classes for views
class BaseTestCase:
    class NoLoginViews(TestCase):
        databases = ['default', 'weatherdb']
        url_suffix = ''
        url_name = ''
        template = ''

        def setUp(self):
            self.app_names = list(set(
                list(settings.APPS_ALT_NAMES.values()) + ["HydroApps"]
                ))
            self.url = '/de/{app_name}/auth/' + self.url_suffix

        def test_view_url_exists_at_desired_location(self):
            for app_name in self.app_names:
                url = self.url.format(app_name=app_name)
                resp = self.client.get(url)
                self.assertEqual(
                    resp.status_code, 200,
                    msg=f"View not accessible at desired url: {url}")

        def test_view_url_accessible_by_name(self):
            for app_name in self.app_names:
                resp = self.client.get(reverse(self.url_name, kwargs={"app_name":app_name}))
                self.assertEqual(
                    resp.status_code, 200,
                    msg=f"View not accessible by name: {self.url_name} & app_name: {app_name}")

        def test_view_uses_correct_template(self):
            for app_name in self.app_names:
                resp = self.client.get(reverse(self.url_name, kwargs={"app_name": app_name}))
                self.assertTemplateUsed(
                    resp, self.template,
                    msg_prefix=f"View ({app_name}:{self.url_name}) does not use correct template: {self.template}")
                self.assertTemplateUsed(
                    resp, f'{app_name}/base.html',
                    msg_prefix=f"View ({app_name}:{self.url_name}) does not use correct base template: {app_name}/base.html")

    class LoggedInViews(NoLoginViews):
        def setUp(self):
            super().setUp()
            self.account = Account.objects.create_user(
                username='testuser',
                first_name="Test",
                last_name="User",
                email="test@test.de",
                password='testpassword',
                confirmed_data_policy=True)
            self.client.login(username='testuser', password='testpassword')

        def test_loging_in(self):
            self.assertTrue(
                self.client.login(username='testuser', password='testpassword'),
                msg="User can't log in with username")

# Test cases for views
class RegisterViewTest(BaseTestCase.NoLoginViews):
    url_suffix = 'accounts/register/'
    url_name = 'register'
    template = 'registration/registration_form.html'

class LoginViewTest(BaseTestCase.NoLoginViews):
    url_suffix = 'accounts/login/'
    url_name = 'login'
    template = 'registration/login.html'

class PasswordResetViewTest(BaseTestCase.NoLoginViews):
    url_suffix = 'accounts/password_reset/'
    url_name = 'password_reset'
    template = 'registration/password_reset_request_form.html'

class ProfileViewTest(BaseTestCase.LoggedInViews):
    url_suffix = 'accounts/profile/'
    url_name = 'user_profile'
    template = 'users/profile.html'

class LogoutViewTest(BaseTestCase.LoggedInViews):
    url_suffix = 'accounts/logout/'
    url_name = 'logout'

    def test_view_uses_correct_template(self):
        pass