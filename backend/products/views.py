import re
import requests
from bs4 import BeautifulSoup
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from supabase import create_client, Client
from django.http import JsonResponse
from .models import Product
import dotenv
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


logger = logging.getLogger(__name__)


SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
class BrandListView(APIView):
    def get(self, request):
        try:
            response = supabase.table('products').select('brand').execute()

            if response.data:
                brands = set(brand['brand'] for brand in response.data if brand['brand'])
                return Response(list(brands), status=status.HTTP_200_OK)
            else:
                return Response({"error": "No brands found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TrendingProductsView(APIView):
    def get(self, request):
        """
        Retrieve trending products from Supabase
        """
        currency = request.GET.get('currency', 'USD')
        exchange_rates = {"INR": 86.1, "EUR": 0.96, "USD": 1}

        try:
            response = supabase.table('products').select('*').limit(21).execute()

            if response.data:
                for product in response.data:
                    rate = exchange_rates.get(currency, 1)
                    product["price"] = round(product["price"] * rate, 2)
                return Response(response.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "No trending products found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        except Exception as e:
            logger.error(f"Error fetching trending products: {str(e)}")
            return Response(
                {"error": "Unable to fetch trending products"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def product_search(request):
    search_query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    
    if not search_query and not category:
        return JsonResponse({'error': 'Both "q" and "category" parameters cannot be empty'}, status=400)

    products = Product.objects.all()
    
    if search_query:
        products = products.filter(title__icontains=search_query)
    
    if category:
        products = products.filter(category__icontains=category)

    if 'brand' in request.GET:
        base_query = base_query.ilike('brand', f"%{request.GET['brand']}%")


    product_data = [
        {
            'title': product.title,
            'price': product.price,
            'description': product.description,
            'image': product.image,
            'brand': product.brand,
            'link': product.link
        }
        for product in products
    ]
    
    return JsonResponse({'products': product_data})

class SearchProductsView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        category = request.GET.get('category', '')
        brand = request.GET.get('brand', '')
        currency = request.GET.get('currency', 'USD')
        
        logger.info(f"Received search request - query: {query}, category: {category}")
        
        try:
            base_query = supabase.table('products').select('*')
            
            conditions = []
            
            if query:
                logger.info(f"Applying search filter for query: {query}")
                search_terms = [
                    f"title.ilike.%{query}%",
                    f"description.ilike.%{query}%",
                    f"brand.ilike.%{query}%"
                ]
                conditions.extend(search_terms)
            
            if category and category != 'All':
                logger.info(f"Applying category filter: {category}")
                conditions.append(f"category.ilike.%{category}%")

            if brand:
                conditions.append(f"brand.ilike.%{brand}%")
            
            if conditions:
                base_query = base_query.or_(','.join(conditions))
            
            logger.info("Executing Supabase query")
            response = base_query.execute()
            
            if response.data:
                logger.info(f"Query returned {len(response.data)} results")

                exchange_rates = {"INR": 86.1, "EUR": 0.96, "USD": 1}

                for product in response.data:
                    product["price"] = round(product["price"] * exchange_rates.get(currency, 1), 2)
                
                
                if category and category != 'All':
                    filtered_data = []
                    for product in response.data:
                        product_categories = product.get('category', '').split(', ')
                        if category in product_categories:
                            filtered_data.append(product)
                    return Response(filtered_data, status=status.HTTP_200_OK)
                
                return Response(response.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "No products found"},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Error in search view: {str(e)}", exc_info=True)
            return Response(
                {
                    "error": "An unexpected error occurred during search",
                    "details": str(e) if settings.DEBUG else None
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


