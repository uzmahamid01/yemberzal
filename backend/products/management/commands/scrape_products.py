from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from django.core.management.base import BaseCommand
from products.models import Product
from supabase import create_client, Client
from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from django.core.management.base import BaseCommand
from products.models import Product
import re



# Replace with your actual Supabase details
SUPABASE_URL='https://ttbmtzdxkwzqccvqbdhb.supabase.co'
SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Ym10emR4a3d6cWNjdnFiZGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTg1MjQsImV4cCI6MjA0OTM3NDUyNH0.mCNdki2NG7XIYSMKENzHHcCiq4bRtOJiLSeVSOPKK0M'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_price(price_text):
    """
    Clean and extract a decimal price from various formats
    """
    # Remove 'From', newlines, currency symbols
    price_text = str(price_text).replace('From', '').replace('\n', '')
    
    # Extract first number with optional decimal
    match = re.search(r'\$?(\d+(?:\.\d+)?)', price_text)
    if match:
        return match.group(1)
    return None

def get_selenium_driver():
    options = Options()
    options.add_argument('--headless')  # Run in headless mode
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    return driver

# def scrape_products():
#     url = 'https://koshurindia.shop/'
    
#     # Get the Selenium driver
#     driver = get_selenium_driver()
    
#     try:
#         driver.get(url)
        
#         # Wait for product elements
#         wait = WebDriverWait(driver, 20)
        
#         # Use the selector that found the most products
#         products = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[class*="product"]')))
        
#         product_data = []
#         for product in products[:50]:  # Increased to 50 for more comprehensive scraping
#             try:
#                 # More flexible title extraction attempts
#                 title_selectors = [
#                     '[class*="title"]', 
#                     '[class*="name"]', 
#                     '.product-title', 
#                     'h3', 
#                     'h2'
#                 ]
                
#                 title = "Unknown Product"
#                 for selector in title_selectors:
#                     try:
#                         title = product.find_element(By.CSS_SELECTOR, selector).text
#                         if title:
#                             break
#                     except:
#                         continue

#                 # More flexible price extraction
#                 price_selectors = [
#                     '[class*="price"]', 
#                     '.product-price', 
#                     '[data-price]'
#                 ]
                
#                 price = None
#                 for selector in price_selectors:
#                     try:
#                         price_text = product.find_element(By.CSS_SELECTOR, selector).text
#                         cleaned_price = clean_price(price_text)
#                         if cleaned_price:
#                             price = cleaned_price
#                             break
#                     except:
#                         continue

#                 # Image extraction
#                 try:
#                     image_url = product.find_element(By.CSS_SELECTOR, 'img').get_attribute('src')
#                 except:
#                     image_url = None

#                 # Product link extraction
#                 try:
#                     product_link = product.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
#                 except:
#                     product_link = None

#                 # Try to extract brand (this might need customization)
#                 try:
#                     brand_selectors = [
#                         '[class*="brand"]', 
#                         '.product-brand', 
#                         '[data-brand]'
#                     ]
#                     brand = None
#                     for selector in brand_selectors:
#                         try:
#                             brand = product.find_element(By.CSS_SELECTOR, selector).text
#                             if brand:
#                                 break
#                         except:
#                             continue
#                 except:
#                     brand = None

#                 product_info = {
#                     'title': title,
#                     'price': price,
#                     'image': image_url,
#                     'link': product_link,
#                     'brand': brand,
#                     'description': None  # You might want to extract this separately
#                 }

#                 print(f"Found product: {product_info}")
#                 product_data.append(product_info)

#             except Exception as e:
#                 print(f"Error extracting individual product: {e}")
        
#         return product_data

#     except Exception as e:
#         print(f"Error during overall scraping: {e}")
#         return []
#     finally:
#         driver.quit()

def scrape_products():
    # url = 'https://koshurindia.shop/'
    # url = 'https://tulpalav.com/shop/'
    url = 'https://kashmirloom.com/collections/women-contemporary-cashmere-shawls-stoles-scarfs'
    
    # Get the Selenium driver
    driver = get_selenium_driver()
    
    try:
        driver.get(url)
        
        # Wait for product elements
        wait = WebDriverWait(driver, 20)
        
        # Use the selector that found the most products
        products = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[class*="product"]')))
        
        product_data = []
        for product in products[:50]:  # Increased to 50 for more comprehensive scraping
            try:
                # Extract product title
                title_selectors = [
                    '[class*="title"]', 
                    '[class*="name"]', 
                    '.product-title', 
                    'h3', 
                    'h2'
                ]
                
                title = "Unknown Product"
                for selector in title_selectors:
                    try:
                        title = product.find_element(By.CSS_SELECTOR, selector).text
                        if title:
                            break
                    except:
                        continue

                # Extract product price
                price_selectors = [
                    '[class*="price"]', 
                    '.product-price', 
                    '[data-price]'
                ]
                
                price = None
                for selector in price_selectors:
                    try:
                        price_text = product.find_element(By.CSS_SELECTOR, selector).text
                        cleaned_price = clean_price(price_text)
                        if cleaned_price:
                            price = cleaned_price
                            break
                    except:
                        continue

                # Extract product image
                try:
                    image_url = product.find_element(By.CSS_SELECTOR, 'img').get_attribute('src')
                except:
                    image_url = None

                # Extract product link
                try:
                    product_link = product.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
                except:
                    product_link = None

                # Try to extract brand (this might need customization)
                brand = None
                
                # First, try to extract brand using specific selectors
                brand_selectors = [
                    '[class*="brand"]', 
                    '.product-brand', 
                    '[data-brand]'
                ]
                for selector in brand_selectors:
                    try:
                        brand = product.find_element(By.CSS_SELECTOR, selector).text
                        if brand:
                            break
                    except:
                        continue

                # Fallback: Extract brand from the page URL or title if not found
                if not brand:
                    brand = url.split('/')[2].split('.')[0]  # Extract brand from domain, e.g. "koshurindia" from "koshurindia.shop"
                
                # Fallback to title if no brand found in the URL
                if not brand:
                    brand = title.split()[0]  # Take the first word of the title as a possible brand name

                product_info = {
                    'title': title,
                    'price': price,
                    'image': image_url,
                    'link': product_link,
                    'brand': brand,
                    'description': None  # You might want to extract this separately
                }

                print(f"Found product: {product_info}")
                product_data.append(product_info)

            except Exception as e:
                print(f"Error extracting individual product: {e}")
        
        return product_data

    except Exception as e:
        print(f"Error during overall scraping: {e}")
        return []
    finally:
        driver.quit()


def save_products_to_supabase(products):
    # Save to local Django database
    for product in products:
        try:
            Product.objects.create(
                title=product['title'][:255],  # Truncate to fit max length
                price=product['price'],
                image=product['image'],
                link=product['link'],
                brand=product['brand'],
                description=product['description']
            )
        except Exception as e:
            print(f"Error saving product to local database: {e}")

    # Save to Supabase
    for product in products:
        try:
            supabase.table('products').insert({
                'title': product['title'],
                'price': product['price'],
                'image': product['image'],
                'link': product['link'],
                'brand': product['brand'],
                'description': product['description']
            }).execute()
        except Exception as e:
            print(f"Error saving product to Supabase: {e}")

class Command(BaseCommand):
    help = 'Scrapes products and saves them to the database'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting product scrape...')
        
        # Step 1: Scrape products
        products = scrape_products()
        
        # Step 2: Save products to the local database and Supabase
        if products:
            save_products_to_supabase(products)
            self.stdout.write(f'Successfully scraped and saved {len(products)} products')
        else:
            self.stdout.write('No products found or there was an issue scraping the website.')