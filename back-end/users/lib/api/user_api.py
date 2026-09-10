from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ..service.user_service import *
from users.lib.serializer.user_serializer import CreateUserSerializer, DisplayUserSerializer, UserProfileSeriliazer, ChangePasswordSerializer
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from users.models import UserModel
from ...common.custom_pagination import StandardResultsSetPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from ...permission import IsAdmin
from rest_framework_simplejwt.tokens import RefreshToken
paginator = StandardResultsSetPagination()
filters = DjangoFilterBackend()
search = SearchFilter()

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request: Request) -> Response:
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username,password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        refresh =RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response({
            'access': str(access),
            'username': user.username,
            'role': user.role,
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,          
            samesite='Strict', 
            path='/api/refresh/token/',  
            max_age=60 * 60 * 24 * 7,   
         ) 
        return response
class LogoutView(APIView):
    def post(self, request: Request) -> Response:   
        response = Response({'message':'Logged out successfully'},status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token', path='/api/refresh/token/')
   
        return response
class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'No refresh token'}, status=401)
        try:
            refresh = RefreshToken(refresh_token)
        except TokenError:
            return Response({'detail': 'Invalid or expired token'}, status=401)

        response = Response({'access': str(refresh.access_token)})

        return response   
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request) -> Response:
        user = current_user(request.user.username)
        serializer = DisplayUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class CreateUserView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    def post(self, request: Request) -> Response:
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user_data = create_user(serializer.validated_data)
            serializer = DisplayUserSerializer(user_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    def put(self, request, pk:int) -> Response:
        try:
  
            user_data = get_user_by_id(pk)

            self.check_object_permissions(request,user_data)
            
            serializer = CreateUserSerializer(instance=user_data, data=request.data, partial=True)

            if serializer.is_valid():
                updated_user = update_user(user_data, serializer.validated_data)
                serializer = DisplayUserSerializer(updated_user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserModel.DoesNotExist:
            return Response({'error':'User does not found.'}, status=status.HTTP_404_NOT_FOUND)

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    def delete(self, request, pk: int) -> Response:
        try:                  
         
            user_data = get_user_by_id(pk)
            self.check_object_permissions(request,user_data)
         
            delete_user(user_data)
          
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserModel.DoesNotExist:
            return Response({'error':'User does not found.'}, status=status.HTTP_404_NOT_FOUND)

class GetAllUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    search_fields = ['username','first_name','last_name']
    filterset_fields = ['role']
    def get(self, request:Request) -> Response:

        users = get_all_user(request.user)
        users = filters.filter_queryset(request, users, self)
        users = search.filter_queryset(request, users, self)
        page_result = paginator.paginate_queryset(users, request)
        serializer = DisplayUserSerializer(page_result, many=True)
        return paginator.get_paginated_response(serializer.data)

class GetUserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request:Request)-> Response:
        user_data = get_user_profile_by_username(request.user.username)
        serializer = UserProfileSeriliazer(user_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request: Request) -> Response:
        username = request.user.username
        user_data = get_user_profile_by_username(username)
        serializer = UserProfileSeriliazer(data=request.data)

        if serializer.is_valid():
            updated_user_data = update_user(user_data, serializer.validated_data)
            serializer = UserProfileSeriliazer(updated_user_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request:Request) -> Response:
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            update_user(request.user, serializer.validated_data)
            return Response( {"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




        

        


