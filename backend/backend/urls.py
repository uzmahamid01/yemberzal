from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path("", TemplateView.as_view(template_name="frontend/build/index.html")),
    # Catch-all URL pattern for frontend routing
    re_path(r'^(?!api/).*', TemplateView.as_view(template_name='frontend/build/index.html')),
]
