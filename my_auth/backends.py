from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.auth.backends import ModelBackend

from .models import Permission

User = get_user_model()

class EmailOrUsernameAuthenticationBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(
                Q(username=username) | Q(email=username)
            )

        except User.DoesNotExist:
            return None

        if user and check_password(password, user.password):
            return user

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def _get_user_permissions(self, user_obj):
        return user_obj.permissions.all()

    def _get_group_permissions(self, user_obj):
        # Not implemented yet
        return Permission.objects.none()

    def _get_permissions(self, user_obj, obj, from_name):
        """
        Return the permissions of `user_obj` from `from_name`. `from_name` can
        be either "group" or "user" to return permissions from
        `_get_group_permissions` or `_get_user_permissions` respectively.
        """
        if not user_obj.is_active or user_obj.is_anonymous or obj is not None:
            return set()

        perm_cache_name = "_%s_perm_cache" % from_name
        if not hasattr(user_obj, perm_cache_name):
            if user_obj.is_superuser:
                perms = Permission.objects.all()
            else:
                perms = getattr(self, "_get_%s_permissions" % from_name)(user_obj)
            perms = perms.values_list("app__name", "permission_class__name").order_by()
            setattr(
                user_obj, perm_cache_name, {f"{app}.{perm}" for app, perm in perms}
            )
        return getattr(user_obj, perm_cache_name)