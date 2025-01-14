from django.urls import path
from .views import SearchProductsView
from .views import TrendingProductsView
from .views import BrandListView

urlpatterns = [
    path('products/search/', SearchProductsView.as_view(), name='search-products'),
    path('products/trending/', TrendingProductsView.as_view(), name='trending-products'),
    path('brands/', BrandListView.as_view(), name='brand-list'),

]