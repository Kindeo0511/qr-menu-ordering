from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from menu.models import CategoryMenu, FoodMenu, Table 
from users.models import UserModel
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from io import BytesIO
from PIL import Image

class CustomerMenuAPITestCase(APITestCase):
    def setUp(self):
        self.admin_user = UserModel.objects.create_user(
            username="admin",
            password="admin123",
            role="AD",
        )

        self.category = CategoryMenu.objects.create(
                name="Meals",
                )

        self.food_data = FoodMenu.objects.create(
            category= self.category,
            name="Burger",
            price=4.99,
        )

        self.client.force_authenticate(self.admin_user)
        self.get_all_food_url = reverse('food-menu')
        self.get_food_categories_url = reverse('food-categories')

    def get_test_photo(self):
        buffer = BytesIO()
        image = Image.new("RGB", (10, 10), color="red")
        image.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")


    def test_get_all_food(self):
        response = self.client.get(self.get_all_food_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        assert response.data["results"][0]["name"] == "Burger"
    def test_search_food_by_name(self):
        response = self.client.get(self.get_all_food_url, {"search": "Burger"}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"][0]["name"] == "Burger"

    def test_get_all_categories(self):
        response = self.client.get(self.get_food_categories_url, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert "results" in response.data
        assert response.data["results"][0]["name"] == "Meals"

    def test_filter_category_by_name(self):
        response = self.client.get(self.get_food_categories_url, {"name": "Meals"}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"][0]["name"] == "Meals"

    
