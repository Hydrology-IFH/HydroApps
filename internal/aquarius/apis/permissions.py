from rest_framework import permissions

from my_auth.config import USER_CLASS, EDIT_USER_CLASS
from my_auth.models import TokenPermission
from ..config import AQUARIUS_APP_NAME

class BasePermission(permissions.BasePermission):
    def has_permission(self, request, *args, **kwargs):
        token = request.session.get("token_permission", None)
        if token:
            if TokenPermission.objects.get(token=token)\
                    .has_perm(f"{AQUARIUS_APP_NAME}.{self._permission_class}"):
                return True
        return request.user.has_perm(f"{AQUARIUS_APP_NAME}.{self._permission_class}")

class ReadPermission(BasePermission):
    _permission_class = USER_CLASS

class EditPermission(BasePermission):
    _permission_class = EDIT_USER_CLASS