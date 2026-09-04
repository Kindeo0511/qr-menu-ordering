from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from ..service.table_order_service import orders_today, count_pending_payments
from ..service.table_service import count_available_tables, count_unavailable_tables
from ..service.payment_service import count_revenue_today
from rest_framework.permissions import IsAuthenticated
class DashBoardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request:Request) -> Response:
        today_revenue = count_revenue_today()
        today_orders = orders_today()
        available_tables = count_available_tables()
        unavailable_tables = count_unavailable_tables()
        pending_payments = count_pending_payments()
        return Response(
            {
            'today_revenue':today_revenue,
            'today_orders':today_orders,
            'available_tables':available_tables,
            'unavailable_tables':unavailable_tables,
            'pending_payments':pending_payments,

            }
            ,status=status.HTTP_200_OK)
