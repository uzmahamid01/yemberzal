from django.core.management.base import BaseCommand
from bs4 import BeautifulSoup
import requests
import re
import concurrent.futures

class Command(BaseCommand):
    help = 'Scrape product data from zarzeb'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting the scraping process...")

        baseurl = 'https://www.zarzeb.com'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        def fetch_product_details(link):
            try:
                response = requests.get(link, headers=headers)
                soup = BeautifulSoup(response.content, 'html.parser')
                
                products = []
                # Find product containers using multiple class identifiers
                product_containers = soup.find_all('div', class_=re.compile(r'\bhJDwNd-AhqUyc-II5mzb\b'))
                
                for container in product_containers:
                    # Extract title
                    title_tag = container.find('h2', class_='zfr3Q')
                    title = title_tag.get_text(strip=True) if title_tag else "No title"
                    
                    # Extract price
                    price_tag = container.find('p', class_='zfr3Q')
                    price = price_tag.get_text(strip=True) if price_tag else "Price not available"
                    price = re.sub(r'[^\d.]', '', price)
                    
                    # Extract image URLs from background-image styles
                    image_divs = container.find_all('div', class_='nQBJnb')
                    images = [re.search(r'url\("?(.*?)"?\)', div['style']).group(1) 
                             for div in image_divs if 'style' in div.attrs]
                    
                    # Extract WhatsApp link
                    whatsapp_tag = container.find('a', href=lambda x: x and 'wa.me' in x)
                    whatsapp_link = whatsapp_tag['href'] if whatsapp_tag else None
                    
                    product_data = {
                        'title': title,
                        'price': f"${price}" if price else "Price not available",
                        'images': images,
                        'whatsapp_link': whatsapp_link,
                        'source_url': link
                    }
                    products.append(product_data)
                    self.stdout.write(f"Found product: {title}")

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

            self.stdout.write(f"Total products scraped: {len(all_products)}")
            return all_products

        # Run the scraper
        items = scrape()

        # Optional: Save results
        # import json
        # with open('products.json', 'w') as f:
        #     json.dump(items, f)

        self.stdout.write("Scraping completed.")