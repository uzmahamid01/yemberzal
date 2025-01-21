
from bs4 import BeautifulSoup
import requests
import pandas as pd
import concurrent.futures
import time
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter
from supabase import create_client, Client
from django.conf import settings
from products.models import Product, Category
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

def get_product_links(session, base_url, page):
    """Extract product links from a single page."""
    page_url = f'{base_url}/shop/page/{page}/'
    try:
        r = session.get(page_url)
        soup = BeautifulSoup(r.content, 'lxml')
        productlist = soup.find_all('div', class_='product')
        return [item.find('a')['href'] for item in productlist if item.find('a')]
    except Exception as e:
        print(f"Error on page {page}: {e}")
        return []

def extract_brand_name(url):
    """Extract brand title from URL."""
    url = url.replace('https://', '').replace('http://', '')
    brand = url.split('.')[0]
    return brand.replace('-', ' ').title()

def scrape_product(session, link):
    """Scrape data for a single product."""
    try:
        r = session.get(link)
        soup = BeautifulSoup(r.content, 'lxml')
        
        productname = soup.find('h1', class_='product_title entry-title wd-entities-title')
        price = soup.find('p', class_='price')
        img_tag = soup.find('img', class_='wp-post-image wp-post-image')
        image_url = img_tag.get('data-src') if img_tag else None
        meta_label = soup.find('span', class_='meta-label')
        if meta_label and meta_label.text == "Categories:":
            meta_label.decompose()  

        # category = [a.get_text() for a in soup.find_all('a', rel='tag')]
        category = [a.get_text() for a in soup.find_all('a', rel='tag')]
        
        categories_str = ', '.join(category) if category else 'N/A'
                
        return {
            'brand': extract_brand_name(link),
            'title': productname.text.strip() if productname else 'N/A',
            'image': image_url,
            'price': price.text if price else 'N/A',
            'link': link,
            'description': 'No description available.',  
            'category': categories_str 
        }
    except Exception as e:
        print(f"Error scraping {link}: {e}")
        return None

def clean_price(price_str):
    match = re.search(r'\d+\.\d+', price_str)
    if match:
        return match.group(0)  
    return '0.00'  

def save_to_supabase(products):
    """Save products to Supabase."""

    for product in products:
        try:
            # categories_str = ', '.join(product['category']) if product['category'] else 'N/A'

            supabase.table('products').insert({
                'title': product['title'],
                'price': clean_price(product['price']).replace('$', '').replace(',', '').strip(),
                'description': product['description'],
                'image': product['image'],
                'brand': product['brand'],
                'link': product['link'],
                'category': product['category']
            }).execute()
        except Exception as e:
            print(f"Error saving to Supabase: {e}")

def main():
    base_url = 'https://tulpalav.com'
    session = create_session()
    
    print("Collecting product links...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_page = {executor.submit(get_product_links, session, base_url, page): page for page in range(1, 17)}
        product_links = set()
        for future in concurrent.futures.as_completed(future_to_page):
            links = future.result()
            product_links.update(links)
    
    print(f"Found {len(product_links)} unique products")
    
    print("Scraping product details...")
    products = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_link = {executor.submit(scrape_product, session, link): link for link in product_links}
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

