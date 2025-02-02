from django.core.management.base import BaseCommand
from bs4 import BeautifulSoup
import requests
import re
import concurrent.futures
import csv

class Command(BaseCommand):
    help = 'Scrape product data from zarzeb'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting the scraping process...")

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        def fetch_product_details(link):
            try:
                response = requests.get(link, headers=headers)
                soup = BeautifulSoup(response.content, 'html.parser')
                
                products = []
                # Correct product container selection using specific class pattern
                product_containers = soup.find_all('div', class_=lambda x: x and 'JNdkSc' in x)
                
                for container in product_containers:
                    # Extract title
                    title_tag = container.find('h2', class_='zfr3Q')
                    title = title_tag.get_text(strip=True) if title_tag else "No title"
                    
                    # Extract price
                    price_tag = container.find('p', class_='zfr3Q')
                    price_text = price_tag.get_text(strip=True) if price_tag else ""
                    price = re.sub(r'[^\d.]', '', price_text) if price_text else "0.00"
                    
                    # Extract images
                    image_divs = container.find_all('div', class_='nQBJnb')
                    images = [re.search(r'url\(["\']?(.*?)["\']?\)', div['style']).group(1) 
                            for div in image_divs if div.has_attr('style')]
                    
                    # Extract WhatsApp link
                    whatsapp_tag = container.find('a', href=lambda x: x and 'wa.me' in x)
                    whatsapp_link = whatsapp_tag['href'] if whatsapp_tag else None
                    
                    product_data = {
                        'title': title,
                        'price': f"${price}" if price else "Price not available",
                        'images': ', '.join(images),
                        'whatsapp_link': whatsapp_link,
                        'source_url': link
                    }
                    products.append(product_data)

                return products
                
            except Exception as e:
                self.stdout.write(f"Error processing {link}: {str(e)}")
                return []

        def scrape():
            collection_links = [
                'https://www.zarzeb.com/shop/pherans',
                # Add other collection URLs here
            ]

            all_products = []
            with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
                future_to_url = {executor.submit(fetch_product_details, url): url for url in collection_links}
                for future in concurrent.futures.as_completed(future_to_url):
                    all_products.extend(future.result())

            return all_products

        # Execute and save results
        items = scrape()
        
        if items:
            with open('products.csv', 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['title', 'price', 'images', 'whatsapp_link', 'source_url']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(items)
            self.stdout.write(self.style.SUCCESS(f"Successfully saved {len(items)} products to products.csv"))
        else:
            self.stdout.write(self.style.ERROR("No products found to save"))

        self.stdout.write("Scraping completed.")