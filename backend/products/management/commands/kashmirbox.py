
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

def extract_image_url(url_or_html):
    """
    Extract image URL from either a URL or an HTML snippet.
    
    Args:
        url_or_html (str): Either a full URL or an HTML snippet
    
    Returns:
        str: First found image URL or None
    """
    # Check if input looks like a full URL
    if url_or_html.startswith('http'):
        try:
            # Fetch the webpage content
            response = requests.get(url_or_html, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
            })
            html_content = response.text
        except Exception as e:
            print(f"Error fetching URL: {e}")
            return None
    else:
        # Assume it's an HTML snippet
        html_content = url_or_html

    # Parse the HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # First, check for img tag within noscript
    noscript_img = soup.select_one('noscript img')
    if noscript_img and 'src' in noscript_img.attrs:
        src_url = noscript_img['src']
        return 'https:' + src_url if src_url.startswith('//') else src_url
    
    # If no noscript img, fall back to regular img tag
    img_tag = soup.find('img')
    if img_tag and 'src' in img_tag.attrs:
        src_url = img_tag['src']
        return 'https:' + src_url if src_url.startswith('//') else src_url
    
    return None

def scrape_product(session, link):
    """Scrape data for a single product."""
    try:
        r = session.get(link)
        soup = BeautifulSoup(r.content, 'lxml')
        
        productname = soup.find('h1', class_='product__heading h2')
        
        if not productname:
            productname = soup.find('title')  
        
        productname = productname.text.strip() if productname else 'No title available'
        
        price = soup.find('span', class_='price-item price-item--sale')
        price = price.text.strip() if price else 'N/A'


        # img_tags = soup.find_all('img', class_='product__media')
        img_url = extract_image_url(link)
        #need to add category and description ------- later part
        # category = soup.find('span', class_='product__category')

       
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
    match = re.search(r'\d+\.\d+', price_str)
    if match:
        return match.group(0) 
    return '0.00' 

def save_to_supabase(products):
    """Save products to Supabase."""

    for product in products:
        try:
            supabase.table('products').insert({
                'title': product['title'],
                'price': clean_price(product['price']).replace('$', '').replace(',', '').strip(),
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
    base_url = 'https://global.kashmirbox.com/'
    session = create_session()

    collection_names = ["nayaab", "meher", "rang-e-khizan", "pashm", "diwaan-e-khas", "nigeen", "posh"]
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
