from bs4 import BeautifulSoup
import requests
import pandas as pd
import concurrent.futures
import time
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter
from supabase import create_client, Client
import os
from django.core.management.base import BaseCommand
from decimal import Decimal
import re

# Supabase credentials
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Command(BaseCommand):
    help = 'Scrapes product data from Zooni and saves it to the database'

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
    brand = url.split('.')[0]
    return brand.replace('-', ' ').title()


def scrape_product(session, link):
    """Scrape data for a single product."""
    try:
        r = session.get(link)
        soup = BeautifulSoup(r.content, 'lxml')

        # Extract product title
        title_tag = soup.find('h1', class_='product-info__title')
        productname = title_tag.get_text(strip=True) if title_tag else 'No title found'

        # Extract price safely
        price_tag = soup.find('span', class_='product-price__regular money')
        price = Decimal(re.sub(r'[^\d.]', '', price_tag.get_text(strip=True))) if price_tag else Decimal('0.00')

        # Extract description safely
        desc_tag = soup.find('div', class_='product-tabs__tab-content js-product-tab-content rte')
        description = desc_tag.get_text(strip=True) if desc_tag else 'No description available'

        # Extract image from `data-image` attribute
        image_url = None
        image_div = soup.find('div', class_='product-images__thumb-wrapper')

        if image_div and 'data-image' in image_div.attrs:
            image_url = image_div['data-image']

        # If the URL is relative (starts with //), prepend 'https:'
        if image_url and image_url.startswith('//'):
            image_url = 'https:' + image_url

        category = ["Shawl", "Scarf", "Stole", "Pashmina", "Kani", "Kalamkari", "Sozni", "Plain Handwoven Pashmina"]

        # print(f"Extracted Image URL for {productname}: {image_url}")

        return {
            'brand': extract_brand_name(link),
            'title': productname,
            'image': image_url,
            'price': price,
            'link': link,
            'description': description,
            'category': category  
        }
    except Exception as e:
        print(f"Error scraping {link}: {e}")
        return None


def clean_price(price_str):
    """Extract numeric price value as a decimal string."""
    match = re.search(r'\d+\.\d+', str(price_str))
    return match.group(0) if match else '0.00'


def save_to_supabase(products):
    """Save scraped products to Supabase."""
    for product in products:
        try:
            supabase.table('products').insert({
                'title': product['title'],
                'price': clean_price(product['price']).replace('$', '').replace(',', '').strip(),
                'description': product['description'],
                'image': product['image'],
                'brand': product['brand'],
                'link': product['link'],
                'category': ', '.join(product['category']) 
            }).execute()
        except Exception as e:
            print(f"Error saving to Supabase: {e}")


def main():
    base_url = 'https://zooni.co.uk'
    session = create_session()

    collection_names = ["sozni", "qalamkar", "plain-handwoven-pashmina"]    
    all_product_links = set()

    for collection in collection_names:
        print(f"Collecting product links from collection '{collection}'...")
        page_url = f'{base_url}/collections/{collection}'
        r = session.get(page_url)
        soup = BeautifulSoup(r.content, 'lxml')

        # Find all product links in the collection page
        product_links = soup.find_all('a', class_='product-grid-item__image')

        # Extract valid URLs
        for link in product_links:
            href = link.get('href')
            if href:
                full_link = base_url + href if href.startswith('/') else href
                all_product_links.add(full_link)

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




# from bs4 import BeautifulSoup
# import requests
# import pandas as pd
# import concurrent.futures
# import time
# from urllib3.util.retry import Retry
# from requests.adapters import HTTPAdapter
# from supabase import create_client, Client
# from django.conf import settings
# from products.models import Product
# import dotenv
# import os
# from django.core.management.base import BaseCommand
# from decimal import Decimal
# import re

# SUPABASE_URL = os.getenv('SUPABASE_URL')
# SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# class Command(BaseCommand):
#     help = 'Scrapes product data from Amazon and saves it to the database'

#     def handle(self, *args, **kwargs):
#         self.stdout.write("Starting scraping process...")
#         main()  
#         self.stdout.write("Scraping completed successfully!")

# def create_session():
#     """Create a session with retry strategy."""
#     session = requests.Session()
#     retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])
#     session.mount('https://', HTTPAdapter(max_retries=retries))
#     session.headers = {
#         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
#     }
#     return session

# def main():
#     base_url = 'https://zooni.co.uk'
#     session = create_session()

#     collection_names = ["sozni", "qalamkar", "plain-handwoven-pashmina"]
#     all_product_links = set()

#     for collection in collection_names:
#         # print(f"Collecting product links from collection '{collection}'...")
#         page_url = f'{base_url}/collections/{collection}'
#         r = session.get(page_url)
#         soup = BeautifulSoup(r.content, 'lxml')

#         # Find all product links in the collection page
#         product_links = soup.find_all('a', class_='product-grid-item__image')
#         for link in product_links:
#             full_link = base_url + link['href']
#             all_product_links.add(full_link)
    
#     print(f"Found {len(all_product_links)} unique products")


#     for link in all_product_links:
#         try:
#             r = session.get(link)
#             soup = BeautifulSoup(r.content, 'lxml')

#             # Extract product details safely
#             title_tag = soup.find('h1', class_='product-info__title')
#             title = title_tag.get_text(strip=True) if title_tag else 'No title found'

#             price_tag = soup.find('span', class_='product-price__regular money')
#             price = Decimal(re.sub(r'[^\d.]', '', price_tag.get_text(strip=True))) if price_tag else Decimal('0.00')

#             desc_tag = soup.find('div', class_='product-tabs__tab-content js-product-tab-content rte')
#             description = desc_tag.get_text(strip=True) if desc_tag else 'No description available'

            


#             # Extract the best image URL
#             image_url = None

#             # Look for div with data-image attribute
#             image_div = soup.find('div', class_='product-images__thumb-wrapper')

#             if image_div and 'data-image' in image_div.attrs:
#                 image_url = image_div['data-image']

#             # If the URL is relative (starts with //), prepend 'https:'
#             if image_url and image_url.startswith('//'):
#                 image_url = 'https:' + image_url

#             # Print extracted URL for debugging
#             print("Extracted Image URL:", image_url)


#             product = {
#                 'title': title,
#                 'price': price,
#                 'description': description,
#                 'image': image_url,
#                 'source_url': link
#             }

#             # Save to CSV
#             df = pd.DataFrame([product])
#             df.to_csv('products.csv', mode='a', header=False, index=False)
#             print(f"Saved product: {title}")

#         except Exception as e:
#             print(f"Error processing {link}: {str(e)}")



# if __name__ == "__main__":
#     start_time = time.time()
#     main()
#     print(f"Execution time: {time.time() - start_time:.2f} seconds")