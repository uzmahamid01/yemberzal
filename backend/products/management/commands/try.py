from django.core.management.base import BaseCommand
from bs4 import BeautifulSoup
import requests
import concurrent.futures
import re

class Command(BaseCommand):
    help = 'Scrape product data from koshurindia.shop'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting the scraping process...")

        # Scraping logic
        baseurl = 'https://www.kashmirbox.com'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
        }

        collection_links = []

        # Fetch all collection links
        def fetch_collection_links():
            for x in range(1, 18):
                r = requests.get(f'https://koshurindia.shop/collections/all?page={x}#collection-root', headers=headers)
                soup = BeautifulSoup(r.content, 'lxml')
                collections = soup.find_all('div', class_='collection--body--root')

                for item in collections:
                    for link in item.find_all('a', href=True):
                        collection_links.append(baseurl + link['href'])

        # Fetch product details from collection
        def fetch_product_details(link):
            r = requests.get(link, headers=headers)
            soup = BeautifulSoup(r.content, 'lxml')
            products = soup.find_all('div', class_='collection--body--root')
            
            item_list = []
            for product in products:
                title_tag = product.find('h1', class_='product--page-heading')
                title = title_tag.text if title_tag else "No title"
                
                price_tag = product.find('div', class_='product-price--original')
                price = price_tag.text if price_tag else "Price not available"
                price = re.sub(r'[^\d.]+', '', price)  # Remove non-numeric characters
                
                img_tag = soup.find('img', class_='loaded')
                image = img_tag.get('data-src') if img_tag else None
                
                # Clean and store item
                item = {
                    'title': title,
                    'price': price,
                    'image': image
                }
                item_list.append(item)
                self.stdout.write(f"Item added: {item}")
            
            return item_list

        # Main scraping function
        def scrape():
            fetch_collection_links()
            self.stdout.write(f"Found {len(collection_links)} collection links.")
            
            # Use concurrent futures to scrape products in parallel
            all_items = []
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                results = executor.map(fetch_product_details, collection_links)
                
                for result in results:
                    all_items.extend(result)

            self.stdout.write(f"Total items scraped: {len(all_items)}")
            return all_items

        # Run the scraper
        items = scrape()

        # Optionally, you can save the data or process it further
        # For example, save to a CSV or database if needed
        # import pandas as pd
        # df = pd.DataFrame(items)
        # df.to_csv('scraped_products.csv', index=False)
        self.stdout.write("Scraping completed.")
