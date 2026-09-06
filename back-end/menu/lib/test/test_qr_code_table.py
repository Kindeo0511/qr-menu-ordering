from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from menu.models import Table 
from users.models import UserModel
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from io import BytesIO
from PIL import Image

class QRTableCodeAPITestCase(APITestCase):

    def setUp(self):
        self.admin_user = UserModel.objects.create_user(
            username="admin",password="admin123",role="AD")

        self.table_data = Table.objects.create(
            table_number = 1,
            qr_data = "test_qr_data",
            qr_image_url = self.get_test_photo(),   
        )
      


        self.client.force_authenticate(self.admin_user)
        self.create_table_url = reverse('create-table')
        self.update_table_url = reverse('update-table',kwargs={'pk':self.table_data.table_number})
        self.delete_table_url = reverse('delete-table',kwargs={'pk':self.table_data.table_number})
        self.get_table_list_url = reverse('all-table')
        self.get_table_url = reverse('get-table', kwargs={'pk':self.table_data.table_number})
        self.generate_qr_table_url = reverse('generate-qr-table', kwargs={'number':self.table_data.table_number})


    def get_test_photo(self):
        buffer = BytesIO()
        image = Image.new("RGB", (10, 10), color="red")
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")

    def test_show_all_qr_table(self):
        response = self.client.get(self.get_table_list_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Table.objects.count(),1)

    def test_create_qr_table(self):
        data = {"table_count":2}

        response = self.client.post(self.create_table_url,data,format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Table.objects.count(),3)

    def test_update_qr_table(self):
        data = {"table_number":5}
        response = self.client.patch(self.update_table_url,data,format="json")
        print(response.content)
        self.table_data.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Table.objects.count(),1)
        self.assertEqual(Table.objects.get().table_number, data["table_number"])

    def test_delete_qr_table(self):
        response = self.client.delete(self.delete_table_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Table.objects.count(),0)

    def test_get_qr_table_by_table_number(self):
        response = self.client.get(self.get_table_url, format="json")
        print(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data["table_number"],self.table_data.table_number)

    def test_get_qr_table_not_exists(self):
        url = reverse('get-table', kwargs={'pk':9999})
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)

    def test_empty_field(self):
        data = {}
        response = self.client.post(self.create_table_url,data, format="json" )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_generate_qr_table(self):
        response = self.client.post(self.generate_qr_table_url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    def test_unauthorized_user(self):
        self.client.force_authenticate()
        response = self.client.delete(self.delete_table_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Table.objects.count(),1)

