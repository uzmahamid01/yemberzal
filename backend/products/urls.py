from django.urls import path
from .views import SearchProductsView
from .views import TrendingProductsView
from .views import BrandListView
from .views import product_search
from .views import product_search
# from .views import VisitCountView


urlpatterns = [
    path('products/search/', SearchProductsView.as_view(), name='search-products'),
    path('products/trending/', TrendingProductsView.as_view(), name='trending-products'),
    path('brands/', BrandListView.as_view(), name='brand-list'),
    path('products/', SearchProductsView.as_view(), name='product-list'),
    # path('increment-visit-count/', VisitCountView.as_view(), name='increment_visit_count'),



]