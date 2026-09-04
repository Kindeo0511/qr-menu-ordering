from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from ..serializer.menu_serializer import CategorySerializer, DisplayCategorySerializer
from ..service.category_service import *
from ...common.custom_pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
paginator = StandardResultsSetPagination()

class CreateCategoryView(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request: Request) -> Response:
        serializer = CategorySerializer(data = request.data)
        if serializer.is_valid():
            menu_category = create_category(serializer.validated_data)
            serializer = DisplayCategorySerializer(menu_category)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShowAllCategoryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request: Request) -> Response:
        category_name = request.query_params.get('name',None)
        categories = get_all_category(category_name)
        page_result = paginator.paginate_queryset(categories,request)
        serializer = DisplayCategorySerializer(page_result, many=True, context={'request':request})
        return paginator.get_paginated_response(serializer.data)

class UpdateCategoryView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk:int) -> Response:
        try:
            old_category = get_category_by_id(pk)
            serializer = CategorySerializer(instance=old_category,data = request.data)
            if serializer.is_valid():
                updated_category = update_category(old_category, serializer.validated_data)
                serializer = DisplayCategorySerializer(updated_category)
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CategoryMenu.DoesNotExist:
            return Response({'error: ':"Category not found."}, status=status.HTTP_404_NOT_FOUND)\

class DeleteCategoryView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk:int) -> Response:
        try:

            category = get_category_by_id(pk)
            delete_category(category)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CategoryMenu.DoesNotExist:
            return Response({'error: ':"Category not found."}, status=status.HTTP_404_NOT_FOUND)

class GetCategoryByIdView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, pk:int) -> Response:
        try:
            category = get_category_by_id(pk)
            serializer = DisplayCategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CategoryMenu.DoesNotExist:
            return Response({'error: ':"Category not found."}, status=status.HTTP_404_NOT_FOUND)
            