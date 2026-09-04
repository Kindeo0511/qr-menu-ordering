from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from ..serializer.menu_serializer import DisplayFoodSerializer
from ..service.food_service import *
from rest_framework.permissions import IsAuthenticated,AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from ...common.custom_pagination import StandardResultsSetPagination
from ..serializer.menu_serializer import TableSerializer
from ..service.table_service import *
from ..serializer.menu_serializer import DisplayCategorySerializer
from ..service.category_service import *
filters = DjangoFilterBackend()
search = SearchFilter()
paginator = StandardResultsSetPagination()


class ShowFoodCategoryView(APIView):
    def get(self,request: Request) -> Response:
        category_name = request.query_params.get('name',None)
        categories = get_all_category(category_name)
        page_result = paginator.paginate_queryset(categories,request)
        serializer = DisplayCategorySerializer(page_result, many=True, context={'request':request})
        return paginator.get_paginated_response(serializer.data)

class ShowFoodMenuView(APIView):
    filterset_fields = ['name','category']
    search_fields  = ['name']
    def get(self,request:Request) -> Response:
        foods = get_all_food().filter(is_active=True)
        foods = filters.filter_queryset(request, foods, self)
        foods = search.filter_queryset(request, foods, self) 
        page_result = paginator.paginate_queryset(foods, request)

        serializer = DisplayFoodSerializer(page_result, many=True, context={"request":request})
        return paginator.get_paginated_response(serializer.data)

class ShowCustomerTableView(APIView):

    search_fields = ['table_number']
    def get(self, request:Request) -> Response:
        tables = get_all_qr_table()
        tables = search.filter_queryset(request,tables,self)
        page_result = paginator.paginate_queryset(tables,request)
        serializer = TableSerializer(page_result, many=True, context={'request':request})
        return paginator.get_paginated_response(serializer.data)
    
class GetCustomerTableById(APIView):

    def get(self, request, pk:int) -> Response:
        try:
            table_data = get_qr_table(pk)
            serializer = TableSerializer(table_data, context={'request':request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Table.DoesNotExist:
            return Response({'error: ':'Table does not found.'}, status=status.HTTP_404_NOT_FOUND)

