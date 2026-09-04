from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from ..serializer.menu_serializer import TableOrderSerializer, DispalyTableOrderSerializer, UpdateOrderStatusSerializer, UpdatePaymentStatusSerializer
from ..service.table_order_service import *
from rest_framework.permissions import IsAuthenticated, AllowAny
class CreateTableOrdersView(APIView):
    permission_classes = [AllowAny]
    def post(self, request: Request) -> Response:
        serializer = TableOrderSerializer(data= request.data)
        if serializer.is_valid():
            create_table_order =create_orders(serializer.validated_data)
            serializer = DispalyTableOrderSerializer(create_table_order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateTableOrderView(APIView):
    permission_classes = [AllowAny]
    def patch(self, request, pk:int) ->Response:
        try:
            table_order = get_table_order(pk)
            serializer = UpdateOrderStatusSerializer(data=request.data, partial=True)
            if serializer.is_valid():
                updated_order_status = update_order_status(table_order,serializer._validated_data)
                serializer = DispalyTableOrderSerializer(updated_order_status)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        except TableOrders.DoesNotExist:
            return Response({'error: ':'Table orders not found.'}, status=status.HTTP_404_NOT_FOUND)

class UpdatePaymentStatus(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, pk:int) ->Response:
        try:
            table_order = get_table_order(pk)
            serializer = UpdatePaymentStatusSerializer(data=request.data, partial=True)
            if serializer.is_valid():
                updated_order_status = update_order_status(table_order,serializer._validated_data)
                serializer = DispalyTableOrderSerializer(updated_order_status)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        except TableOrders.DoesNotExist:
            return Response({'error: ':'Table orders not found.'}, status=status.HTTP_404_NOT_FOUND)

class ShowAllTableOrderView(APIView):
    permission_classes = [AllowAny]
    def get(self, request: Request) -> Response:
        all_table_order = show_all_orders()
        serializer = DispalyTableOrderSerializer(all_table_order, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

