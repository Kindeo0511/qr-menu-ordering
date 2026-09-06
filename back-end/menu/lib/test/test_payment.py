from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from menu.models import TableOrders,Orders, Table, FoodMenu, CategoryMenu, Payment 
from users.models import UserModel
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

class TestPaymentAPITestCase(APITestCase):
    def setUp(self):
        self.admin_user = UserModel.objects.create_user(
            username="admin",
            password="admin123",
            role="AD"
        )
        self.category_data = self.create_category_mock_data()
        self.food_data = self.create_food_mock_data(category_data=self.category_data)
        self.table_data = self.create_table_mock_data()
        self.table_order = self.create_order_mock_data(table_data=self.table_data, orders=self.food_data, qty=1)
        self.total_amount =0
        self.amount_received = 500
        self.payment_data = self.create_payment_record_mock_data(
            table_order=self.table_order,
            user=self.admin_user,
            total_amount=self.total_amount,
            amount_received=self.amount_received 
            )
        
        self.client.force_authenticate(self.admin_user)
        self.process_payment_url = reverse('process-payment')
        self.get_all_payment_records_url = reverse('show-all-payment')
        self.get_payment_record_url = reverse('get-payment',kwargs={'pk':self.payment_data.id})
        self.get_weekly_revenue = reverse('weekly-revenue')

        self.get_dashboard_stats_url = reverse('dashboard-stats')


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

    def create_order_mock_data(self,table_data, orders, qty):
        table_order = TableOrders.objects.create(
                table=table_data,
            )
        table = table_order.table
        table.status = "Occupied"
        table.save(update_fields=["status"])
        Orders.objects.create(table_order=table_order,  food=orders, qty=qty)
        self.total_amount = orders.price * qty
        return table_order

    def create_payment_record_mock_data(self,table_order,user,total_amount, amount_received):
        payment_data = Payment.objects.create(
            table_order=table_order,
            cashier=user,
            total_amount= total_amount,
            amount_received= amount_received
         )
        table_order = payment_data.table_order
        table = table_order.table
    
        table.status = "Available"
        table.save(update_fields=["status"])
    
        table_order.payment_status = "Paid"
        table_order.save(update_fields=["payment_status"])
        
        return payment_data
    
    def get_test_photo(self):
        buffer = BytesIO()
        image = Image.new("RGB", (10, 10), color="red")
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")

    # def test_show_all_payment_records(self):
    #     response = self.client.get(self.get_all_payment_records_url, format='json')

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(Payment.objects.count(),1)
    #     self.assertEqual(TableOrders.objects.get().payment_status, "Paid")
    #     self.assertEqual(Table.objects.get().status, "Available")

    #     payment_record = response.data["results"][0]
    #     self.assertEqual(payment_record["table_order"]["payment_status"], "Paid")
    #     self.assertEqual(payment_record["cashier"], "admin")
    #     self.assertEqual(payment_record["amount_received"], "500.00")

    # def test_proccess_payment(self):
    #     new_table_order = self.create_order_mock_data(
    #     table_data=self.table_data,
    #     orders=self.food_data,
    #     qty=1
    #  )

    #     data = {
    #         "table_order": new_table_order.id,
    #         "user": self.admin_user,  
    #         "total_amount": self.total_amount,
    #         "amount_received": 1000
    #     }

    #     response = self.client.post(self.process_payment_url, data)
    #     print(response.content)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Payment.objects.count(),2)

    #     self.assertEqual(response.data["table_order"]["payment_status"], "Paid")
    #     self.assertEqual(response.data["cashier"], "admin")
    #     self.assertEqual(response.data["amount_received"], "1000.00")

    # def test_get_payment_record(self):
    #     response = self.client.get(self.get_payment_record_url)
    #     print(response.content)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(Payment.objects.count(),1)
    #     self.assertEqual(UserModel.objects.get().username, "admin")
    #     self.assertEqual(TableOrders.objects.get().id, 1)

    #     order = response.data['table_order']['orders'][0]
    #     self.assertEqual(order['id'],1)
    #     self.assertEqual(order['food_name'],"test_name")

    # def test_get_payment_record_not_exists(self):
    #     url = reverse('get-payment',kwargs={'pk':9999})
    #     response = self.client.get(url,format='json')
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # def test_not_authenticated_user(self):

    #     data = {}
    #     self.client.force_authenticate()
    #     response = self.client.post(self.process_payment_url, data)
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    # def test_get_dashboard_stats(self):
    #     response = self.client.get(self.get_dashboard_stats_url,format='json')

    #     self.assertEqual(response.status_code,status.HTTP_200_OK)
    #     self.assertIn("today_revenue", response.data)
    #     self.assertIn("today_orders", response.data)
    #     self.assertIn("available_tables", response.data)
    #     self.assertIn("unavailable_tables", response.data)
    #     self.assertIn("pending_payments", response.data)

    def test_get_weekly_revenue(self):
        response = self.client.get(self.get_weekly_revenue,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        days = [entry["day"] for entry in response.data]
        expected_days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}
        self.assertEqual(set(days), expected_days)

        for entry in response.data:
            self.assertIn("day", entry)
            self.assertIn("revenue", entry)
            self.assertIsInstance(entry["revenue"], float)






     


    