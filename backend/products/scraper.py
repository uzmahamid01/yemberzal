import requests
from bs4 import BeautifulSoup
from supabase import create_client

# Supabase configuration
SUPABASE_URL='https://ttbmtzdxkwzqccvqbdhb.supabase.co'
SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Ym10emR4a3d6cWNjdnFiZGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTg1MjQsImV4cCI6MjA0OTM3NDUyNH0.mCNdki2NG7XIYSMKENzHHcCiq4bRtOJiLSeVSOPKK0M'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# URL to scrape
url = 'https://koshurindia.shop/'

# Send HTTP GET request
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Find all product elements - adjust based on the HTML structure
products = soup.find_all('div', class_='product-item')

# Extract product details and save to Supabase
def save_products_to_supabase(products):
    for product in products:
        title = product.find('h2', class_='product-title').get_text(strip=True)
        price = product.find('span', class_='product-price').get_text(strip=True)
        image_url = product.find('img', class_='product-image')['src']
        product_link = product.find('a', class_='product-link')['href']

        # Save to Supabase
        data = {
            'title': title,
            'price': price,
            'image': image_url,
            'product_link': product_link,
        }
        response = supabase.table('products').insert(data).execute()

        if response.status_code != 201:
            print(f"Failed to insert product: {title}")

# Call the function to scrape and save products
save_products_to_supabase(products)
