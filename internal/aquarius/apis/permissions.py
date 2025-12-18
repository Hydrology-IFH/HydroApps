from rest_framework import permissions

from my_auth.config import USER_CLASS, EDIT_USER_CLASS
from ..config import AQUARIUS_APP_NAME

class ReadPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm(f"{AQUARIUS_APP_NAME}.{USER_CLASS}")

class EditPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm(f"{AQUARIUS_APP_NAME}.{EDIT_USER_CLASS}")