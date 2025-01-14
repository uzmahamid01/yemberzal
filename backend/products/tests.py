from django.test import TestCase
from .models import Product
from rest_framework.test import APIClient
from rest_framework import status

class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product_data = {
            "name": "Kashmiri Jacket",
            "price": 199.99,
            "description": "A traditional hand-embroidered Kashmiri jacket",
            "brand": "Kashmir Style",
            "product_link": "https://example.com/jacket"
        }
        self.product = Product.objects.create(**self.product_data)

    def test_get_products(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_product(self):
        response = self.client.post('/api/products/', self.product_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)  # One product in setUp and one created here
