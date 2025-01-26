
from bs4 import BeautifulSoup
import requests
import pandas as pd
import concurrent.futures
import time
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter
from supabase import create_client, Client
from django.conf import settings
from products.models import Product
import dotenv
import os
from django.core.management.base import BaseCommand
from decimal import Decimal
import re


SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Command(BaseCommand):
    help = 'Scrapes product data from Amazon and saves it to the database'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting scraping process...")
        main()  
        self.stdout.write("Scraping completed successfully!")

def create_session():
    """Create a session with retry strategy."""
    session = requests.Session()
    retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])
    session.mount('https://', HTTPAdapter(max_retries=retries))
    session.headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
    }
    return session


def extract_brand_name(url):
    """Extract brand title from URL."""
    url = url.replace('https://', '').replace('http://', '')
    brand = url.split('.')[1]
    return brand.replace('-', ' ').title()

def extract_image_url(url_or_html, session=None):
    """Extract specific product image URL."""
    # If a full URL is passed, fetch the content
    if url_or_html.startswith('http'):
        try:
            if session is None:
                import requests
                session = requests.Session()
            
            response = session.get(url_or_html)
            html_content = response.text
        except Exception as e:
            print(f"Error fetching URL {url_or_html}: {e}")
            return None

    soup = BeautifulSoup(html_content, 'lxml')
    
    # Prioritize product images over logos
    product_img = soup.select_one('.product__media img[src*="/cdn/shop/files/"]')
    
    if product_img and 'src' in product_img.attrs:
        img_url = product_img['src']
        # Remove width parameter to get base image URL
        base_url = "https:" + img_url.split('&width=')[0]
        return base_url

    return None

def scrape_product(session, link):
    """Scrape data for a single product."""
    try:
        r = session.get(link)
        soup = BeautifulSoup(r.content, 'lxml')
        
        productname = soup.find('h1', class_='product__title')
        
        if not productname:
            productname = soup.find('title')  
        
        productname = productname.text.strip() if productname else 'No title available'
        
        price = soup.find('span', class_='price-item price-item--sale price-item--last')
        price = price.text.strip() if price else 'N/A'


        price = clean_price(price)
        img_url = extract_image_url(link)
       
        return {
            'brand': extract_brand_name(link),
            'title': productname,
            'image': img_url,
            'price': price,
            'link': link,
            'description': 'No description available.' 
        }
    except Exception as e:
        print(f"Error scraping {link}: {e}")
        return None


def clean_price(price_str): 
    """Clean and convert the price from Rs to USD."""
    if price_str.startswith('Rs. '):
        price_str = price_str.replace('Rs. ', '').replace('Rs. ', '').strip()
        price_str = price_str.replace(',', '')  # Remove commas for numeric conversion
        
        try:
            usd_price = Decimal(price_str) / Decimal(86)  # INR to USD conversion
            # Format the result to 2 decimal places
            return f"${usd_price:.2f}"
        except Exception as e:
            print(f"Error converting price: {price_str} - {e}")
            return '$0.00'
    
    match = re.search(r'\d+\.\d+', price_str)
    if match:
        return f"${match.group(0)}" 
    
    return '$0.00'


def save_to_supabase(products):
    """Save products to Supabase."""

    for product in products:
        try:
            supabase.table('products').insert({
                'title': product['title'],
                'price': float(product['price']) if isinstance(product['price'], Decimal) else product['price'],
                'description': product['description'],
                'image': product['image'],
                'brand': product['brand'],
                'link': product['link'],
                'category': 'uncategorized'  
            }).execute()
        except Exception as e:
            print(f"Error saving to Supabase: {e}")



def get_product_links(session, base_url, collection_name):
    """Extract product links from all pages in a single collection."""
    product_links = []
    
    page_number = 1
    while True:
        page_url = f'{base_url}/collections/{collection_name}?page={page_number}'
        try:
            r = session.get(page_url)
            soup = BeautifulSoup(r.content, 'lxml')
            productlist = soup.find_all('li', class_='grid__item')
            
            if not productlist:
                break

            print(f"Found {len(productlist)} products on page {page_number}.")
            
            links = [f"{base_url}{item.find('a')['href']}" for item in productlist if item.find('a')]
            product_links.extend(links)
            
            page_number += 1  
        except Exception as e:
            print(f"Error on page {page_number}: {e}")
            break  
            
    return product_links



def main():
    base_url = 'https://www.kashmirorigin.com/'
    session = create_session()

    collection_names = ["kashmiri-pheran-online", "ponchos", "winter-suits", "silk-jacket", "woolen-wraps", "cord-set", "tips-&-kurtis", "suits", "sarees", "kaftan"]
    all_product_links = set()

    for collection in collection_names:
        print(f"Collecting product links from collection '{collection}'...")
        product_links = get_product_links(session, base_url, collection)
        all_product_links.update(product_links)
    
    print(f"Found {len(all_product_links)} unique products")

    print("Scraping product details...")
    products = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_link = {executor.submit(scrape_product, session, link): link for link in all_product_links}
        for future in concurrent.futures.as_completed(future_to_link):
            product = future.result()
            if product:
                products.append(product)
    
    print(f"Saving {len(products)} products...")
    save_to_supabase(products)

    df = pd.DataFrame(products)
    df.to_csv('products.csv', index=False)
    print("Saved products to CSV.")

if __name__ == "__main__":
    start_time = time.time()
    main()
    print(f"Execution time: {time.time() - start_time:.2f} seconds")


