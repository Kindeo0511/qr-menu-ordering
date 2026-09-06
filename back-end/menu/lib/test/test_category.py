from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from menu.models import CategoryMenu 
from users.models import UserModel
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from io import BytesIO
from PIL import Image


class CategoryAPITestCase(APITestCase):

    def setUp(self):

        self.admin_user = UserModel.objects.create_superuser(username='admin',password='admin123',role='AD')
        self.cashier_user = UserModel.objects.create_user(username='cashier',password='cashier123',role='CA')

        current_dir = os.path.dirname(__file__)
        self.project_root = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
        image_path = os.path.join(self.project_root, "media", "test_pictures", "test_image.jpg")

     
           
        self.category = CategoryMenu.objects.create(
            name="test_category",
            photo=self.get_test_photo()

        )


        self.create_category_url = reverse('create-category-menu')
        self.update_category_url = reverse('update-category-menu',kwargs={'pk':self.category.id})
        self.delete_category_url = reverse('delete-category-menu',kwargs={'pk':self.category.id})
        self.category_list_url = reverse('show-all-category-menu')

    def get_test_photo(self):
        buffer = BytesIO()
        image = Image.new("RGB", (10, 10), color="red")
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")

    def test_get_categories(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.category_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_category(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "name":"new category",
            "photo":self.get_test_photo()
        }
        response = self.client.post(self.create_category_url, data, format='multipart')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CategoryMenu.objects.count(),2)
        self.assertEqual(response.data["name"], data['name'])

    def test_update_category(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "name":"updated category",
            "photo":self.get_test_photo()
        }
        response = self.client.put(self.update_category_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CategoryMenu.objects.count(),1)
        self.assertEqual(response.data["name"], data['name'])

    def test_delete_category(self):
        self.client.force_authenticate(self.admin_user)
        response = self.client.delete(self.delete_category_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_empty_fields(self):
        self.client.force_authenticate(self.admin_user)
        data={}
        response = self.client.post(self.create_category_url,data,format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_not_authenticated_user(self):
        data = {
            "name":"new category",
            "photo":self.get_test_photo()
        }
        response = self.client.post(self.create_category_url, data, format='multipart')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(CategoryMenu.objects.count(),1)
        







