from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserModel

class UserAdmin(BaseUserAdmin):
    model = UserModel
    list_filter = ["is_staff", "is_superuser", "role", "is_active"]
    list_display = ["username", "email", "first_name", "last_name", "role", "is_staff"]
    ordering = ["-id"]

    fieldsets = (
        ("User Information", {"fields": ("first_name", "last_name", "email", "contact_number")}),
        ("Account", {"fields": ("username", "password")}),
        ("Role", {"fields": ("role",)}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2", "role", "is_staff", "is_active"),
        }),
    )

admin.site.register(UserModel, UserAdmin)