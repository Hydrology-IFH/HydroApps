"""
Simplified Configuration for Aquarius API Adapter
"""

try:
    from secretSettings_HydroApps import AQUARIUS_CONFIG
except ImportError:
    raise ImportError("Please define AQUARIUS_CONFIG in your secretSettings_HydroApps.py file.")

AQUARIUS_USER = AQUARIUS_CONFIG.get('AQUARIUS_USER')
AQUARIUS_PWD = AQUARIUS_CONFIG.get('AQUARIUS_PWD')
AQUARIUS_URL = AQUARIUS_CONFIG.get('AQUARIUS_URL')
if AQUARIUS_USER is None or AQUARIUS_PWD is None or AQUARIUS_URL is None:
    raise ValueError("AQUARIUS_USER, AQUARIUS_PWD, and AQUARIUS_URL must be set in AQUARIUS_CONFIG in secretSettings_HydroApps.py")
AQUARIUS_API_ENDPOINTS_URL = {
    "provision": "Provisioning/v1/",
    "publish": "Publish/v2/",
    "acquisition": "Acquisition/v2/"
}

# Ensure the API URL ends with a slash
if not AQUARIUS_URL.endswith('/'):
    AQUARIUS_URL = AQUARIUS_URL + '/'
for endpoint in AQUARIUS_API_ENDPOINTS_URL.keys():
    if not AQUARIUS_API_ENDPOINTS_URL[endpoint].endswith('/'):
        AQUARIUS_API_ENDPOINTS_URL[endpoint] += '/'

# Rate limiting configuration (per user per minute)
RATE_LIMIT_PER_USER = AQUARIUS_CONFIG.get('RATE_LIMIT_PER_USER', 20)

# Allowed API endpoints
AQUARIUS_API_ALLOWED_ROUTES = {
    "publish": [
        'GetLocationData',
        'GetLocationDescriptionList',
        'GetParameterList',
        'GetTagList',
        'GetTimeSeriesDescriptionList',
        'GetTimeSeriesData'
    ],
    "provision": [
        'locations',
        'locationfolders',
    ]
}

# Required permission class for Aquarius API access
PERMISSION_CLASS_READ = 'aquarius-read'
PERMISSION_CLASS_EDIT = 'aquarius-edit'
AQUARIUS_PERMISSION_APP = 'internal:AQUARIUS'

# caching
API_CACHE_DURATION = AQUARIUS_CONFIG.get('API_CACHE_DURATION', 60 * 60 * 24)
API_CACHE_PREFIX = "internal_aquarius_api"

del AQUARIUS_CONFIG