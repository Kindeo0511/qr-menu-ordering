from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from menu.models import CategoryMenu,FoodMenu 
from users.models import UserModel
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from io import BytesIO
from PIL import Image

class FoodAPITestCase(APITestCase):

    def setUp(self):

        self.admin_user = UserModel.objects.create_user(username='admin',password='admin123',role='AD')

                  
        self.category_data = CategoryMenu.objects.create(
            name="test_category",
            photo=self.get_test_photo()

        )

        self.food_data = FoodMenu.objects.create(
            category= self.category_data,
            name="test_name",
            price=4.99,
            food_img=self.get_test_photo(),
        )

        self.add_food_url = reverse('create-food-menu')
        self.update_food_url = reverse('update-food-menu',kwargs={'pk':self.food_data.id})
        self.delete_food_url = reverse('delete-food-menu',kwargs={'pk':self.food_data.id})
        self.get_food_url = reverse('get-food-menu',kwargs={'pk':self.food_data.id})
        self.get_all_food_url = reverse('show-all-food-menu')

    def get_test_photo(self):
        buffer = BytesIO()
        image = Image.new("RGB", (10, 10), color="red")
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")


    def test_show_all_food_menu(self):
        self.client.force_authenticate(self.admin_user)
        response = self.client.get(self.get_all_food_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(FoodMenu.objects.count(),1)

    def test_create_food_menu(self):
        self.client.force_authenticate(self.admin_user)
        data = {
            "category": self.category_data.id,
            "name":"new food",
            "price":4.99,
            "food_img":self.get_test_photo(),
        }
        response = self.client.post(self.add_food_url,data,format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FoodMenu.objects.count(),2)
        self.assertEqual(response.data['name'], data['name'])

    def test_update_food_menu(self):
        self.client.force_authenticate(self.admin_user)
        data = {
            "category": self.category_data.id,
            "name":"updated food",
            "price":5.99,
            "food_img":self.get_test_photo(),
        }
        response = self.client.put(self.update_food_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(FoodMenu.objects.count(),1)
        self.assertEqual(response.data['name'], data['name'])

    def test_delete_food_menu(self):
        self.client.force_authenticate(self.admin_user)
        response = self.client.delete(self.delete_food_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(FoodMenu.objects.count(),0)

    def test_get_specific_food(self):
        self.client.force_authenticate(self.admin_user)
        response = self.client.get(self.get_food_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(FoodMenu.objects.count(),1)
        self.assertEqual(FoodMenu.objects.get().name, self.food_data.name)

    def test_get_specific_food_not_exists(self):
        self.client.force_authenticate(self.admin_user)
        url = reverse('get-food-menu',kwargs={'pk':9999})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_not_authenticated_user(self):
        data = {
                "category": self.category_data.id,
                "name":"new food",
                "price":4.99,
                "food_img":self.get_test_photo(),
            }
        response = self.client.post(self.add_food_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(FoodMenu.objects.count(),1)

    def test_empty_fields(self):
        self.client.force_authenticate(self.admin_user)
        data = {}
        response = self.client.post(self.add_food_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(FoodMenu.objects.count(),1)
    
        

    
    


