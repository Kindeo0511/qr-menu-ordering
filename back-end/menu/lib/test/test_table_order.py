from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from menu.models import TableOrders,Orders, Table, FoodMenu, CategoryMenu 
from users.models import UserModel
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from io import BytesIO
from PIL import Image

class TestTableOrderAPITestCase(APITestCase):

    def setUp(self):

        self.admin_user = UserModel.objects.create_user(
            username="admin",
            password="admin123",
            role="AD"
        )
        self.category_data = self.create_category_mock_data()
        self.food_data = self.create_food_mock_data(category_data=self.category_data)
        self.table_data = self.create_table_mock_data()

        self.table_order = self.create_order_mock_data(table_data=self.table_data, orders=self.food_data)
     
        self.client.force_authenticate(self.admin_user)
        self.create_table_order_url = reverse('create-table-order')
        self.get_all_table_order_url = reverse('all-table-orders')
        self.update_table_order_url = reverse('update-table-orders', kwargs={'pk':self.table_order.id})

    def create_category_mock_data(self):
        category_data = CategoryMenu.objects.create(
                    name="test_category",
                    photo=self.get_test_photo())
        return category_data
    
    def create_food_mock_data(self,category_data):
        food_data = FoodMenu.objects.create(
                   category= category_data,
                   name="test_name",
                   price=4.99,
                   food_img=self.get_test_photo(),
               )
        return food_data
    
    def create_table_mock_data(self):
        table_data = Table.objects.create(
                table_number = 1,
                qr_data = "test_qr_data",
                qr_image_url = self.get_test_photo(),   
            )
        return table_data

    def create_order_mock_data(self,table_data, orders):
        table_order = TableOrders.objects.create(
                table=table_data,
            )
        table = table_order.table
        table.status = "Occupied"
        table.save(update_fields=["status"])
        Orders.objects.create(table_order=table_order,  food=orders, qty=1)
        return table_order
  


    def get_test_photo(self):
        buffer = BytesIO()
        image = Image.new("RGB", (10, 10), color="red")
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")

    def test_get_all_table_orders(self):
        response = self.client.get(self.get_all_table_order_url, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(TableOrders.objects.count(),1)
        self.assertEqual(TableOrders.objects.get().order_status, "Pending")
        self.assertEqual(TableOrders.objects.get().payment_status, "Unpaid")
        self.assertEqual(Table.objects.get().status, "Occupied")

        self.assertEqual(response.data[0]["order_status"], "Pending")
        self.assertEqual(response.data[0]["payment_status"], "Unpaid")
        self.assertEqual(response.data[0]["orders"][0]["food_name"], "test_name")
        self.assertEqual(response.data[0]["orders"][0]["qty"], 1)
        

    def test_create_table_order(self):
        data = {
            "table":self.table_data.id,
            "orders":[
            {"food":self.food_data.id,"qty":1}
            ]
            
        }
        response = self.client.post(self.create_table_order_url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TableOrders.objects.count(),2)

        self.assertEqual(response.data["order_status"], "Pending")
        self.assertEqual(response.data["payment_status"], "Unpaid")
        self.assertEqual(response.data["table"], "Table Number: 1")

        self.assertEqual(response.data["orders"][0]["food_name"], "test_name")
        self.assertEqual(response.data["orders"][0]["qty"], 1)

    def test_update_order_status(self):
        data = {"order_status":"Preparing"}

        response = self.client.patch(self.update_table_order_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['order_status'], data['order_status'])
        self.assertEqual(TableOrders.objects.get().order_status, data['order_status'])


        
