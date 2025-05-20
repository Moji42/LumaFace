from django.contrib import admin
from django.urls import path
from rater.views import rate_face

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/rate/', rate_face),
]
