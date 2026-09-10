from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from ..serializer.menu_serializer import SavePaymentSerializer, DisplayPaymentSerializer
from ..service.payment_service import *
from django.db import transaction, IntegrityError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ...permission import IsCashier, IsAdmin
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from ...common.custom_pagination import StandardResultsSetPagination

filters = DjangoFilterBackend()
search = SearchFilter()
paginator = StandardResultsSetPagination()

class ProcessPaymentView(APIView):
    permission_classes = [IsAuthenticated & (IsAdminUser | IsCashier)]
    def post(self, request: Request) -> Response:
        serializer = SavePaymentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    payment = process_payment({**serializer.validated_data, "cashier": request.user})
                    serializer = DisplayPaymentSerializer(payment)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except IntegrityError:
                return Response(
                    {"error": "This order has already been paid."},
                    status=status.HTTP_409_CONFLICT,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShowAllPaymentView(APIView):
    permission_classes = [IsAuthenticated & (IsAdminUser | IsCashier)]
    search_fields = ['cashier__username',
                    'cashier__first_name',
                    'cashier__last_name',
                    'table_order__table__table_number'
                    ]
    filterset_fields = {
    'table_order__payment_status': ['exact'],
    'created_at': ['date', 'gte', 'lte'],
}

    def get(self, request: Request) -> Response:
        payment_records = show_all_payment()
        payment_records = filters.filter_queryset(request,payment_records,self)
        payment_records = search.filter_queryset(request,payment_records,self)
        page_result = paginator.paginate_queryset(payment_records,request)
        serializer = DisplayPaymentSerializer(page_result, many=True)
        return paginator.get_paginated_response(serializer.data)

class GetPaymentByIdView(APIView):
    permission_classes = [IsAuthenticated & (IsAdminUser | IsCashier)]
    def get(self, request, pk:int) -> Response:
        try:
            payment_data = get_payment_by_id(pk)
            serializer = DisplayPaymentSerializer(payment_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({'error: ':'Payment record not found.'}, status=status.HTTP_404_NOT_FOUND)

class WeeklyRevenueView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request:Request) -> Response:
        weekly_revenue = get_weekly_revenue_trend()
        return Response(weekly_revenue,status=status.HTTP_200_OK)