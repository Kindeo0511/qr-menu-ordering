from .category_api import *
from .food_api import *
from .food_order_api import *
from .table_api import *
from .table_order_api import *
from .payment_api import *
from .dashboard_stats import DashBoardStatsView
from .customer_menu_api import *
from django.urls import path

urlpatterns = [
    # CATEGORY API
    path('category-menu/create/', CreateCategoryView.as_view(), name='create-category-menu'),
    path('category-menu/update/<int:pk>/', UpdateCategoryView.as_view(), name='update-category-menu'),
    path('category-menu/delete/<int:pk>/', DeleteCategoryView.as_view(), name='delete-category-menu'),
    path('category-menu/all/', ShowAllCategoryView.as_view(), name='show-all-category-menu'),
    path('category-menu/<int:pk>/', GetCategoryByIdView.as_view(), name='get-category-menu'),

    # FOOD API
    path('food-menu/create/', CreateFoodView.as_view(), name='create-food-menu'),
    path('food-menu/update/<int:pk>/', UpdateFoodView.as_view(), name='update-food-menu'),
    path('food-menu/delete/<int:pk>/', DeleteFoodView.as_view(), name='delete-food-menu'),
    path('food-menu/all/', ShowAllFoodView.as_view(), name='show-all-food-menu'),
    path('food-menu/<int:pk>/', GetFoodView.as_view(), name='get-food-menu'),

    # FOOD ORDER API
    # path('food-order/create/', CreateOrderView.as_view(), name='create-food-order'),
    # path('food-order/all/', ShowAllOrderView.as_view(), name='update-food-order'),

    # TABLE QR CODE API
    path('table/create/', CreateQRTableView.as_view(), name='create-table'),
    path('table/update/<int:pk>/', UpdateQRTableView.as_view(), name='update-table'),
    path('table/delete/<int:pk>/', DeleteQRTableView.as_view(), name='delete-table'),
    path('table/<int:pk>/', GetQRTableByIdView.as_view(), name='get-table'),
    path('table/all/', ShowAllQRTableView.as_view(), name='all-table'),
    path('generate-qr-code/<int:number>/', GenerateQRCodeView.as_view(), name='generate-qr-table'),

    # TABLE ORDERS API
    path('table/create-order/', CreateTableOrdersView.as_view(), name='create-table-order'),
    path('table/all-order/', ShowAllTableOrderView.as_view(), name='all-table-orders'),
    path('table/update-order/<int:pk>/', UpdateTableOrderView.as_view(), name='update-table-orders'),

    # PAYMENT API
    path('payment/process-payment/', ProcessPaymentView.as_view(), name='process-payment'),
    path('payment/all-payment/', ShowAllPaymentView.as_view(), name='show-all-payment'),
    path('payment/<int:pk>/', GetPaymentByIdView.as_view(), name='get-payment'),

    # DASHBOARD API
    path('dashboard/stats/',DashBoardStatsView.as_view(), name='dashboard-stats'),

    # CUSTOMER API
    path('menu/',ShowFoodMenuView.as_view(), name='food-menu'),
    path('table/',ShowCustomerTableView.as_view(), name='qr-table'),
    # path('qr-table/<int:pk>/',GetCustomerTableById.as_view(), name='customer-table'),
    path('categories/',ShowFoodCategoryView.as_view(), name='food-categories'),


    

]