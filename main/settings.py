"""
Django settings for apps.hydro.uni-freiburg.de project.

Generated by 'django-admin startproject' using Django 3.2.8.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
import sys, os
from urllib.parse import urlparse
from django.utils.translation import gettext_lazy as _

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
sys.path.insert(0, BASE_DIR.parent.as_posix())
import secretSettings_HydroApps as secrets

SECRET_KEY = secrets.SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
if "HydroApps_Debug" in os.environ:
    DEBUG = os.environ["HydroApps_Debug"].upper()=="TRUE"
else:
    DEBUG = True

# set secret debug settings
if DEBUG and hasattr(secrets, "DEBUG_SETTINGS"):
    for name in secrets.DEBUG_SETTINGS:
        setattr(secrets, name, secrets.DEBUG_SETTINGS[name])

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    *secrets.ALLOWED_HOSTS]
# to allow debug connection through VPN connection:
# ufw allow from 10.23.0.132 to any port 8000 comment 'once a VPN address'
# Application definition

INSTALLED_APPS = [
    # own
    'weatherDB',
    'my_auth',
    'asgII',
    "HydroApps",
    "kombstra",
    # django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',
    # New packages
    'request', # for statistics, pip install django-request
    'django_q', # to setup tasks to run periodicaly, pip install django-q2
    "django_bootstrap5", # django-bootstrap5
    'hcaptcha', # pip install django-hCaptcha
    'rest_framework', #  djangorestframework
    'rest_framework_gis', # djangorestframework-gis
    'django_filters', # django-filter
    "rest_framework_msgpack"
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # added
    'django.middleware.locale.LocaleMiddleware',
    "request.middleware.RequestMiddleware"
    # 'django.contrib.redirects.middleware.RedirectFallbackMiddleware',
]

# if DEBUG:
#     MIDDLEWARE.append("kolo.middleware.KoloMiddleware") # for VSCode Kolo App

ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.joinpath("main/templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'main.utils.utils.get_context_extra',# add default context, todo: delete from all the other views
            ],
        },
    },
]

WSGI_APPLICATION = 'main.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': secrets.DB_DJ_NAME,
        'USER': secrets.DB_DJ_USER,
        'PASSWORD': secrets.DB_DJ_PWD,
        'HOST': secrets.DB_DJ_HOST,
        'PORT': secrets.DB_DJ_PORT,
        'CONN_MAX_AGE': 120,
        'CONN_HEALTH_CHECKS': True
    },
    'weatherdb': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': secrets.DB_WEA_NAME,
        'USER': secrets.DB_WEA_USER,
        'PASSWORD': secrets.DB_WEA_PWD,
        'HOST': secrets.DB_WEA_HOST,
        'PORT': secrets.DB_WEA_PORT,
        'CONN_MAX_AGE': 120,
        'CONN_HEALTH_CHECKS': True
    }
}

DATABASE_ROUTERS = ['main.routers.MainRouter']


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
AUTH_USER_MODEL = 'my_auth.Account'
AUTHENTICATION_BACKENDS = [
    'my_auth.backends.EmailOrUsernameAuthenticationBackend'
]

#LOGOUT_REDIRECT_URL = 'home'
LOGIN_REDIRECT_URL = "user_profile"
LOGOUT_REDIRECT_URL = "home"

# HCAPTCHA
HCAPTCHA_SITEKEY = secrets.HCAPTCHA_SITEKEY
HCAPTCHA_SECRET = secrets.HCAPTCHA_SECRET

# setup EMAIL
if "EMAIL_HOST" in dir(secrets):
    ACCOUNT_EMAIL_UNIQUE = True
    ACCOUNT_EMAIL_CONFIRMATION_REQUIRED = True
    EMAIL_HOST = secrets.EMAIL_HOST
    EMAIL_PORT = secrets.EMAIL_PORT
    EMAIL_HOST_USER = secrets.EMAIL_HOST_USER
    EMAIL_HOST_PASSWORD = secrets.EMAIL_HOST_PASSWORD
    EMAIL_USE_SSL = secrets.EMAIL_USE_SSL
    EMAIL_USE_TLS = secrets.EMAIL_USE_TLS
    DEFAULT_FROM_EMAIL = secrets.EMAIL_HOST_USER
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# set Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        # 'logfile': {
        #     'level': 'DEBUG',
        #     'class': 'logging.handlers.RotatingFileHandler',
        #     'filename': BASE_DIR / "logs/django.log",
        #     'maxBytes': 50000,
        #     'backupCount': 2
        # },
    },
    'loggers': {
      'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
        # '': {
        #     'handlers': ['console', 'logfile'],
        #     'level': 'DEBUG',
        # },
    }
}
# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

TIME_ZONE = 'UTC'
USE_TZ = True

# setup of translations
LANGUAGES = [
    ('de', _('German')),
    ('en', _('English')),
]
LANGUAGE_CODE = 'en'
USE_I18N = True
USE_L10N = True
LOCALE_PATHS = [
    BASE_DIR / "main/locale"
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

BASE_URL = secrets.BASE_URL
BASE_DOMAIN = urlparse(secrets.BASE_URL).scheme + "://" + urlparse(secrets.BASE_URL).netloc
if not DEBUG:
    STATIC_URL = secrets.BASE_URL + "/static/"
else:
    STATIC_URL = "/static/"
STATIC_ROOT = secrets.STATIC_DIR
STATICFILES_DIRS = [
    BASE_DIR.joinpath("main/static"),
    BASE_DIR.joinpath("static_data"), # for big static files, that should not get synced in the git repository
    ('front-end', BASE_DIR.joinpath('front-end/dist'))
]

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configure your Q cluster
# More details https://django-q.readthedocs.io/en/latest/configure.html
Q_CLUSTER = {
    'retry': 60*60*24*2+2, # in seconds
    'workers': 4,
    'orm': 'default',
    "timeout": 60*60*24*2, # in seconds
    "max_attempts": 1,
    'has_replica': True,
    'name':'django_q_weatherdb'
}

# for user statistics request
REQUEST_BASE_URL = secrets.BASE_URL
REQUEST_LOG_IP=True
REQUEST_LOG_USER=False
REQUEST_IGNORE_PATHS = (
    r'^[//]admin/',
    '[//]favicon.ico'
)
REQUEST_IGNORE_USER_AGENTS = (
    # r'^$', # ignore requests with no user agent string set
    r'Googlebot',
    r'Baiduspider',
)
REQUEST_IGNORE_AJAX=True

# django rest framework settings
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
        "rest_framework_msgpack.renderers.MessagePackRenderer",
    ],
}

# GDAL
if "GDAL_LIBRARY_PATH" in os.environ:
    GDAL_LIBRARY_PATH = os.environ["GDAL_LIBRARY_PATH"]
if "GEOS_LIBRARY_PATH" in os.environ:
    GEOS_LIBRARY_PATH = os.environ["GEOS_LIBRARY_PATH"]

# temporary folder
CACHE_DIR = Path(secrets.CACHE_DIR)
if not CACHE_DIR.is_dir():
    CACHE_DIR = BASE_DIR.parent.joinpath("Cache")
if not CACHE_DIR.is_dir(): CACHE_DIR.mkdir()
CACHE_URL = secrets.BASE_URL + "/weatherdb/downloads/"

# allow website to be loaded in iframe for CMS
X_FRAME_OPTIONS = 'allow-from https://uni-freiburg.de/'

# Google SIte Verification
if hasattr(secrets, "HYDROAPPS_GOOGLE_VERIFICATION"):
    GOOGLE_SITE_VERIFICATION_FILE = secrets.HYDROAPPS_GOOGLE_VERIFICATION

# clean secrets
del secrets

# # for redirect and sites
# SITE_ID = 1

# Cors Headers in debug
if DEBUG:
    INSTALLED_APPS.append("corsheaders")
    MIDDLEWARE.insert(
        MIDDLEWARE.index("django.middleware.common.CommonMiddleware"),
        "corsheaders.middleware.CorsMiddleware")
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:5173"]