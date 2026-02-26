from rest_framework.permissions import BasePermission
from .models import CustomUser


class IsAdminUser(BasePermission):
    """Only users with role=admin can pass."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == CustomUser.Role.ADMIN)


class IsManagerOrAdmin(BasePermission):
    """Users with role=manager or role=admin can pass."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [CustomUser.Role.ADMIN, CustomUser.Role.MANAGER]
        )


class IsStaffOrAbove(BasePermission):
    """Any authenticated staff member."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)