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
import os
import dotenv 

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_price(price_text):
    """
    Clean and extract a decimal price from various formats
    """
    price_text = str(price_text).replace('From', '').replace('\n', '')
    
    match = re.search(r'\$?(\d+(?:\.\d+)?)', price_text)
    if match:
        return match.group(1)
    return None

def get_selenium_driver():
    options = Options()
    options.add_argument('--headless')  
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    return driver

def scrape_products():
    # url = 'https://koshurindia.shop/'
    # url = 'https://tulpalav.com/shop/'
    url = ''
    
    driver = get_selenium_driver()
    
    try:
        driver.get(url)
        
        wait = WebDriverWait(driver, 20)
        
        products = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[class*="product"]')))
        
        product_data = []
        for product in products[:50]:  
            try:
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

                try:
                    image_url = product.find_element(By.CSS_SELECTOR, 'img').get_attribute('src')
                except:
                    image_url = None

                try:
                    product_link = product.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
                except:
                    product_link = None

                brand = None
                
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

                if not brand:
                    brand = url.split('/')[2].split('.')[0] 
                
                if not brand:
                    brand = title.split()[0]  

                product_info = {
                    'brand': brand,
                    'title': title,
                    'image': image_url,
                    'price': price,
                    'link': product_link,
                    'description': None  
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
    for product in products:
        try:
            Product.objects.create(
                title=product['title'][:255], 
                price=product['price'],
                image=product['image'],
                link=product['link'],
                brand=product['brand'],
                description=product['description']
            )
        except Exception as e:
            print(f"Error saving product to local database: {e}")

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
        
        products = scrape_products()
        
        if products:
            save_products_to_supabase(products)
            self.stdout.write(f'Successfully scraped and saved {len(products)} products')
        else:
            self.stdout.write('No products found or there was an issue scraping the website.')