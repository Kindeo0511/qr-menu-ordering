from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('AD', 'ST')
        )

    def has_object_permission(self, request, view, obj):
        requester = request.user

        if requester.role == 'AD':
            return True

        if requester.role == 'ST':
            if obj.role == 'AD':
                return False
            if obj.role == 'ST':
                return obj.username == requester.username
            return True  

        return False



     

