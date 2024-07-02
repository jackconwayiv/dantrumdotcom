from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the album.
        return obj.owner == request.user


class IsOwnerOrRestricted(BasePermission):
    """
    Custom permission to show full details to the owner and restricted details to others.
    """
    def has_object_permission(self, request, view, obj):
        # Allow read-only access for all users
        if request.method in SAFE_METHODS:
            return True
        # Allow full access if the object is the user making the request
        return obj == request.user
    