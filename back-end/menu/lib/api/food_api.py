from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from ..serializer.menu_serializer import FoodSerializer, DisplayFoodSerializer
from ..service.food_service import *
from rest_framework.permissions import IsAuthenticated,AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from ...common.custom_pagination import StandardResultsSetPagination

filters = DjangoFilterBackend()
search = SearchFilter()
paginator = StandardResultsSetPagination()

class ShowAllFoodView(APIView):
    permission_classes = [IsAuthenticated]
    filterset_fields = ['name','category']
    search_fields  = ['name']
    def get(self,request:Request) -> Response:
        foods = get_all_food()
        foods = filters.filter_queryset(request, foods, self)
        foods = search.filter_queryset(request, foods, self) 
        page_result = paginator.paginate_queryset(foods, request)

        serializer = DisplayFoodSerializer(page_result, many=True, context={"request":request})
        return paginator.get_paginated_response(serializer.data)


class CreateFoodView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request:Request) -> Response:
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            new_food = create_food(serializer.validated_data)
            serializer = DisplayFoodSerializer(new_food)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateFoodView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk:int) -> Response:
        try:

            food_data = get_food(pk)
            serializer = FoodSerializer(instance=food_data, data=request.data)
            if serializer.is_valid():
                updated_food_data = update_food(food_data, serializer.validated_data)
                serializer = DisplayFoodSerializer(updated_food_data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except FoodMenu.DoesNotExist:
            return Response({'error:':'Food not found.'})
        
    def patch(self, request, pk:int) -> Response:
        try:

            food_data = get_food(pk)
            serializer = FoodSerializer(instance=food_data, data=request.data, partial=True)
            if serializer.is_valid():
                updated_food_data = update_food(food_data, serializer.validated_data)
                serializer = DisplayFoodSerializer(updated_food_data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except FoodMenu.DoesNotExist:
            return Response({'error:':'Food not found.'})

class DeleteFoodView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk:int) -> Response:
        try:
                
            food_data = get_food(pk)
            delete_food(food_data)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FoodMenu.DoesNotExist:
            return Response({'error:':'Food not found.'})

class GetFoodView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk:int) -> Response:
        try:
            food_data = get_food(pk)
            serializer = DisplayFoodSerializer(food_data, context={"request":request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except FoodMenu.DoesNotExist:
            return Response({'error:':'Food not found.'}, status=status.HTTP_404_NOT_FOUND)

            
    

