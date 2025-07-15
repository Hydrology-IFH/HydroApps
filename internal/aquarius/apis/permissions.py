from rest_framework import permissions
from ..config import (
    PERMISSION_CLASS_READ,
    PERMISSION_CLASS_EDIT,
    AQUARIUS_PERMISSION_APP)

class ReadPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm(f"{AQUARIUS_PERMISSION_APP}.{PERMISSION_CLASS_READ}")

class EditPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm(f"{AQUARIUS_PERMISSION_APP}.{PERMISSION_CLASS_EDIT}")