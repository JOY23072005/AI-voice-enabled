from django.contrib import admin
from django.urls import path
from Home import views
urlpatterns = [
    path("",views.Home,name="Home"),
    path("login",views.Login,name="Login"),
    path("signup",views.SignUp,name="Signup"),
    path("history",views.History,name="History"),
    path("logout",views.Logout,name="Logout")
]
