from django.urls import path
from ..api.user_api import *


urlpatterns = [
    path('login/', LoginView.as_view(), name='login-user'),
    path('logout/', LogoutView.as_view(), name='logged-out-user'),
    path('refresh/token/', CookieTokenRefreshView.as_view(), name='refresh-token'),


    path('user/create/',CreateUserView.as_view(), name='create-user'),
    path('user/update/<int:pk>/',UpdateUserView.as_view(), name='update-user'),
    path('user/delete/<int:pk>/',DeleteUserView.as_view(), name='delete-user'),
    path('user/all-user/',GetAllUserView.as_view(), name='all-user'),
    path('user/me/',CurrentUserView.as_view(), name='current -user'),

    path('user/profile/',GetUserProfileView.as_view(), name='get-user-profile'),
    path('user/update-profile/',UpdateUserProfileView.as_view(), name='update-user-profile'),
    path('user/change-password/',ChangePasswordView.as_view(), name='change-user-password'),

]
