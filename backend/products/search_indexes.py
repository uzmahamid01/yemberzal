from django_elasticsearch_dsl import DocType, Index, fields
from .models import Product

products = Index('products')
products.settings(
    number_of_shards=1,
    number_of_replicas=0
)

@products.document
class ProductDocument(DocType):
    class Django:
        model = Product  

    title = fields.TextField()
    description = fields.TextField()
    price = fields.FloatField()
    image_url = fields.TextField()
    link = fields.TextField()
