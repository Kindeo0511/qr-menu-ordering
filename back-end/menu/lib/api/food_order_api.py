from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializer.menu_serializer import FoodOrderSerializer, DisplayFoodOrderSerializer
from ..service.food_order_service import *

class ShowAllOrderView(APIView):
    permission_classes = [AllowAny]
    def get(self, request:Request) -> Response:
        orders = show_all_food_order()
        serializer = DisplayFoodOrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateOrderView(APIView):
    permission_classes = [AllowAny]
    def post(self, request:Request) -> Response:
        serializer = FoodOrderSerializer(data = request.data)
        if serializer.is_valid():
            order = create_food_order(serializer.validated_data)
            serializer = DisplayFoodOrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
