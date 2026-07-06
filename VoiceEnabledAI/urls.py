from django.contrib import admin
from django.urls import path,include
from VoiceEnabledAI import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include("Home.urls")),
    # In your urls.py file:
    path('api/gemini/', views.gemini_proxy, name='gemini_proxy'),
]
