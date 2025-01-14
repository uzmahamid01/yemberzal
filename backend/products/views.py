import re
import requests
from bs4 import BeautifulSoup
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from supabase import create_client, Client


logger = logging.getLogger(__name__)

# Replace with your actual API key and Search Engine ID
API_KEY = 'AIzaSyAc-0GEngybZwa7BJiwCpH046m_RVQHc0U'
CX = '031853e2c58c74324'  

SUPABASE_URL='https://ttbmtzdxkwzqccvqbdhb.supabase.co'
SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Ym10emR4a3d6cWNjdnFiZGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTg1MjQsImV4cCI6MjA0OTM3NDUyNH0.mCNdki2NG7XIYSMKENzHHcCiq4bRtOJiLSeVSOPKK0M'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class TrendingProductsView(APIView):
    def get(self, request):
        """
        Retrieve trending products from Supabase
        """
        try:
            # Fetch trending products with proper error handling
            response = supabase.table('products').select('*').limit(21).execute()
            
            # Check if the response contains data
            if response.data:
                return Response(response.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "No trending products found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        except Exception as e:
            # Log the full error for debugging
            logger.error(f"Error fetching trending products: {str(e)}")
            return Response(
                {"error": "Unable to fetch trending products"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _get_trending_products(self):
        """
        Helper method to fetch trending products with robust error handling
        """
        try:
            # Query Supabase for the most popular products
            response = supabase.table('products').select('*').limit(21).execute()
            
            # Always check response.data instead of status code
            return response.data or []
        
        except Exception as e:
            logger.error(f"Error while fetching trending products from Supabase: {e}")
            return []
        
class BrandListView(APIView):
    def get(self, request):
        try:
            # Fetch distinct brands from the database
            response = supabase.table('products').select('brand').distinct().execute()
            if response.data:
                brands = [brand['brand'] for brand in response.data]  # Extract brand names
                return Response(brands, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No brands found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    

# class SearchProductsView(APIView):
#     def get(self, request):
#         query = request.GET.get('q', '')
#         category = request.GET.get('category', 'All')  # Get category from query params, default to 'All'
        
#         if not query:
#             return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # If 'All' is selected, fetch products based on the search query
#             if category == 'All':
#                 response = supabase.table('products').select('*').ilike('title', f'%{query}%').execute()
#             else:
#                 # Fetch products based on both query and category
#                 response = supabase.table('products').select('*').ilike('title', f'%{query}%').eq('category', category).execute()

#             if response.data:
#                 return Response(response.data, status=status.HTTP_200_OK)
#             else:
#                 return Response({"error": "No product results found"}, status=status.HTTP_404_NOT_FOUND)

#         except Exception as e:
#             logger.error(f"Unexpected error in search: {e}")
#             return Response({"error": "An unexpected error occurred during search"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class SearchProductsView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        category = request.GET.get('category', 'All')  # Get category from query params, default to 'All'
        brand = request.GET.get('brand', '')
        
        if not query:
            return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Build the search filter for multiple fields
            search_filter = f"title.ilike.%{query}%,description.ilike.%{query}%,brand.ilike.%{query}%"

            if category == 'All':
                # Search across all products with the filter
                response = (
                    supabase.table('products')
                    .select('*')
                    .or_(search_filter)
                    .execute()
                )
            else:
                # Search across products with the filter and category
                response = (
                    supabase.table('products')
                    .select('*')
                    .or_(search_filter)
                    .eq('category', category)
                    .execute()
                )

            if response.data:
                return Response(response.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No product results found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f"Unexpected error in search: {e}")
            return Response({"error": "An unexpected error occurred during search"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        


# class SearchProductsView(APIView):
#     def get(self, request):
#         query = request.GET.get('q', '')
#         if not query:
#             return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # API search results
#             search_results = []
#             search_count = 0
            
#             # Send request to Google Custom Search API
#             search_url = f'https://www.googleapis.com/customsearch/v1'
#             params = {
#                 'q': f"buy {query} online",
#                 'key': API_KEY,
#                 'cx': CX,
#                 'num': 10  # Maximum number of results per query
#             }
            
#             response = requests.get(search_url, params=params)
#             response.raise_for_status()

#             search_data = response.json()
#             items = search_data.get("items", [])
            
#             for item in items:
#                 try:
#                     # Extract product details from each search result URL
#                     url = item['link']
#                     headers = {
#                         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
#                     }

#                     product_info = self._extract_product_details(url, headers)
#                     if product_info:
#                         search_results.append(product_info)
#                         search_count += 1

#                     # Limit to 5 results
#                     if search_count >= 5:
#                         break

#                 except Exception as e:
#                     logger.error(f"Error processing {item['link']}: {e}")

#             if not search_results:
#                 return Response({"error": "No product results found"}, status=status.HTTP_404_NOT_FOUND)

#             return Response(search_results)

#         except Exception as e:
#             logger.error(f"Unexpected error in search: {e}")
#             return Response({"error": "An unexpected error occurred during search"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     def _extract_product_details(self, url, headers):
#         try:
#             response = requests.get(url, headers=headers, timeout=5)
#             if response.status_code != 200:
#                 return {}

#             soup = BeautifulSoup(response.text, 'html.parser')
#             # Check for product-specific structure (e.g., price, product title, etc.)
#             if not self._is_product_page(soup):
#                 print('Not a product page - skipping')
#                 return {}  # Skip non-product pages

#             return {
#                 'title': self._extract_title(soup) or 'No Title',
#                 'description': self._extract_description(soup) or 'No Description',
#                 'price': self._extract_price(soup) or 'Price Not Available',
#                 'brand': self._extract_brand(soup) or 'Unknown Brand',
#                 'image': self._extract_image(soup) or '',
#                 'link': url
#             }

#         except Exception as e:
#             logger.error(f"Error extracting details from {url}: {e}")
#             return {}

#     def _extract_title(self, soup):
#         title_candidates = [
#             soup.find('h1'),
#             soup.find('title'),
#             soup.find('meta', property='og:title'),
#             soup.find('meta', attrs={'name': 'title'})
#         ]
#         for title in title_candidates:
#             if title:
#                 extracted_title = title.get('content', '') if hasattr(title, 'get') else title.get_text(strip=True)
#                 if extracted_title:
#                     return extracted_title
#         return ''

#     def _extract_description(self, soup):
#         desc_candidates = [
#             soup.find('meta', property='og:description'),
#             soup.find('meta', attrs={'name': 'description'}),
#             soup.find('div', class_=re.compile(r'product-?description', re.I)),
#             soup.find('p', class_=re.compile(r'product-?description', re.I))
#         ]
#         for desc in desc_candidates:
#             if desc:
#                 extracted_desc = desc.get('content', '') if hasattr(desc, 'get') else desc.get_text(strip=True)
#                 if extracted_desc:
#                     return extracted_desc
#         return ''

#     def _extract_price(self, soup):
#         price_patterns = [
#             re.compile(r'\$?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)'),
#             re.compile(r'₹\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)'),
#             re.compile(r'Price:\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)')
#         ]
        
#         price_meta = soup.find('meta', property='product:price:amount')
#         if price_meta:
#             return price_meta.get('content', '')
        
#         for element in soup.find_all(text=True):
#             for pattern in price_patterns:
#                 match = pattern.search(str(element))
#                 if match:
#                     return match.group(1)
        
#         return ''

#     def _extract_brand(self, soup):
#         brand_candidates = [
#             soup.find('meta', property='og:site_name'),
#             soup.find('div', class_=re.compile(r'brand', re.I)),
#             soup.find('span', class_=re.compile(r'brand', re.I))
#         ]
#         for brand in brand_candidates:
#             if brand:
#                 extracted_brand = brand.get('content', '') if hasattr(brand, 'get') else brand.get_text(strip=True)
#                 if extracted_brand:
#                     return extracted_brand
#         return ''

#     def _extract_image(self, soup):
#         image_candidates = [
#             soup.find('meta', property='og:image'),
#             soup.find('img', class_=re.compile(r'product-?image', re.I)),
#             soup.find('img', id=re.compile(r'product-?image', re.I))
#         ]
        
#         for image in image_candidates:
#             if image and image.get('src'):
#                 return image.get('src', '')
        
#         return ''
    
#     def _is_product_page(self, soup):
#         # Check for typical product page structure
#         if soup.find('meta', property='og:type') and soup.find('meta', property='og:type').get('content') == 'product':
#             print('Product page detected')
#             return True
#         # Add more checks for specific product page elements (price, availability, etc.)
#         return False
    

