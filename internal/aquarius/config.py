"""
Simplified Configuration for Aquarius API Adapter
"""

try:
    from secretSettings_HydroApps import AQUARIUS_CONFIG
except ImportError:
    raise ImportError("Please define AQUARIUS_CONFIG in your secretSettings_HydroApps.py file.")

AQUARIUS_API_USER = AQUARIUS_CONFIG.get('AQUARIUS_API_USER')
AQUARIUS_API_PWD = AQUARIUS_CONFIG.get('AQUARIUS_API_PWD')
AQUARIUS_API_URL = AQUARIUS_CONFIG.get('AQUARIUS_API_URL')
if not AQUARIUS_API_USER or not AQUARIUS_API_PWD or not AQUARIUS_API_URL:
    raise ValueError("AQUARIUS_API_USER, AQUARIUS_API_PWD, and AQUARIUS_API_URL must be set in AQUARIUS_CONFIG in secretSettings_HydroApps.py")
# Ensure the API URL ends with a slash
if not AQUARIUS_API_URL.endswith('/'):
    AQUARIUS_API_URL = AQUARIUS_API_URL + '/'

# Rate limiting configuration (per user per minute)
RATE_LIMIT_PER_USER = AQUARIUS_CONFIG.get('RATE_LIMIT_PER_USER', 20)

# Allowed API endpoints
AQUARIUS_API_ALLOWED_ENDPOINTS = [
    'GetLocationData',
    'GetLocationDescriptionList',
    'GetParameterList',
    'GetTagList',
    'GetTimeSeriesDescriptionList',
    'GetTimeSeriesData'
]

# Required permission class for Aquarius API access
PERMISSION_CLASS_READ = 'aquarius-read'
PERMISSION_CLASS_EDIT = 'aquarius-edit'
AQUARIUS_PERMISSION_APP = 'internal:AQUARIUS'

del AQUARIUS_CONFIG