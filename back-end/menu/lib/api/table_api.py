from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from ..serializer.menu_serializer import TableSerializer
from ..service.table_service import *
from io import BytesIO
from django.core.files.base import ContentFile
import qrcode
from django.db.models import Max
from ...common.custom_pagination import StandardResultsSetPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
import requests
from reportlab.lib.utils import ImageReader
import os
from reportlab.lib.pagesizes import A6  
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from ordering_admin import settings

paginator = StandardResultsSetPagination()
search = SearchFilter()
class CreateQRTableView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request: Request) -> Response:
        count = request.data.get('table_count')

        max_number = Table.objects.aggregate(Max('table_number'))['table_number__max']
        start_number = (max_number or 0) + 1

        created_tables = []

      
        for i in range(count):
            table_number = start_number + i
            table = Table.objects.create(table_number=table_number)
            # Local Host
            base_url = settings.QR_BASE_URL.rstrip('/')
            qr_payload = f'{base_url}/menu/{table.table_number}/'
            # qr_payload = f'http://192.168.100.70:5173/Order-Menu/{table.table_number}/'

            qr = qrcode.QRCode()
            qr.add_data(qr_payload)
            qr.make(fit=True)
            img = qr.make_image()

            buffer = BytesIO()
            img.save(buffer, format='PNG')

            table.qr_data = qr_payload
            table.qr_image_url.save(
                f'qr_{table.table_number}.png',
                ContentFile(buffer.getvalue()),
                save=False,
            )
            table.save(update_fields=['qr_data', 'qr_image_url'])

            created_tables.append(table)

        serializer = TableSerializer(created_tables, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ShowAllQRTableView(APIView):
    permission_classes = [IsAuthenticated]
    search_fields = ['table_number']
    def get(self, request:Request) -> Response:
        tables = get_all_qr_table()
        tables = search.filter_queryset(request,tables,self)
        page_result = paginator.paginate_queryset(tables,request)
        serializer = TableSerializer(page_result, many=True, context={'request':request})
        return paginator.get_paginated_response(serializer.data)

class DeleteQRTableView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk:int) -> Response:
        try:
            table_data = get_qr_table(pk)
            delete_qr_table(table_data)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Table.DoesNotExist:
                return Response({'error: ':'Table does not found.'}, status=status.HTTP_404_NOT_FOUND)

class GetQRTableByIdView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, pk:int) -> Response:
        try:
            table_data = get_qr_table(pk)
            serializer = TableSerializer(table_data, context={'request':request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Table.DoesNotExist:
            return Response({'error: ':'Table does not found.'}, status=status.HTTP_404_NOT_FOUND)

class UpdateQRTableView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, pk:int) -> Response:
        try:
            table_data = get_qr_table(pk)
            serializer = TableSerializer(data=request.data, partial=True)
            if serializer.is_valid():
                updated_table_data = update_qr_table(table_data, serializer.validated_data)
                serializer = TableSerializer(updated_table_data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Table.DoesNotExist:
            return Response({"error: ":"Table does not found."}, status=status.HTTP_404_NOT_FOUND)

class GenerateQRCodeView(APIView):
    def post(self, request, number: int) -> FileResponse:
        qr_table = get_qr_table(number)

        image_path = qr_table.qr_image_url.path
        if not os.path.exists(image_path):
            return Response(
                {"detail": "QR image file not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        buffer = io.BytesIO()
        page_width, page_height = A6
        p = canvas.Canvas(buffer, pagesize=A6)

        # Brand colors
        border_color = HexColor("#E8E0D2")
        text_color = HexColor("#8C7E68")

        # Card border
        margin = 10 * mm
        p.setStrokeColor(border_color)
        p.setLineWidth(1.5)
        p.roundRect(
            margin, margin,
            page_width - 2 * margin, page_height - 2 * margin,
            radius=6, stroke=1, fill=0,
        )

        # Title
        p.setFillColor(text_color)
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(page_width / 2, page_height - 25 * mm, "Scan to Order")

        # QR code, centered
        qr_size = 70 * mm
        image = ImageReader(image_path)
        qr_x = (page_width - qr_size) / 2
        qr_y = (page_height - qr_size) / 2 - 5 * mm
        p.drawImage(image, qr_x, qr_y, width=qr_size, height=qr_size)

        # Table number label
        p.setFont("Helvetica", 12)
        p.drawCentredString(
            page_width / 2, qr_y - 12 * mm, f"Table {qr_table.table_number}"
        )

        p.showPage()
        p.save()
        buffer.seek(0)

        return FileResponse(
            buffer,
            as_attachment=False,  # inline so it displays in the new tab for printing
            filename="qr_table.pdf",
            content_type="application/pdf",
        )
