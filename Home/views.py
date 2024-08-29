from django.shortcuts import render
from Home.models import *
from django.contrib import messages
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password,check_password
import json
# logged={"islogged":False,"user":"none"}
# Create your views here.
islogged=0
user=""
hist1=""
hist2=""
def Login(request):
    global islogged,user
    if(islogged):
        return redirect("/")
    context={
        "variable":"Login",
        "signin":"SignUp",
        "url":"signup",
        "url2":"login",
    }
    try:
        if (request.method=="POST"):
            name=request.POST.get("name")
            sets=login.objects.filter(name=name)[0]
            raw_password=request.POST.get("password")
            if(check_password(raw_password,sets.password)):
                islogged=1
                user=name
                messages.success(request, "Login Successful")
                return redirect("/")
            else:
                messages.warning(request, "Password is Wrong")
    except:
        messages.warning(request,"No user found")
    return render(request,"login.html",context)

def SignUp(request):
    if(islogged):
        return redirect("/")
    context={
        "variable":"SignUp",
        "signin":"Login",
        "url":"login",
        "url2":"signup",
    }
    try:
        if (request.method=="POST"):
            name=request.POST.get("name")
            raw_password=request.POST.get("password")
            password=make_password(raw_password)
            Login=login(name=name,password=password)
            Login.save()
            messages.success(request, "Profile details updated.")
            return redirect("/login")
    except Exception as e:
            print(e)
            messages.warning(request, "User already exist")
    return render(request,"login.html",context)

def Logout(request):
     global islogged,user
     islogged=0
     user=""
     return redirect("/login")

def Home(request):
    global hist1,hist2
    api_key=settings.API_KEY
    context={
        "signin":"Login/SignUp",
        "apikey":api_key,
        "url":"login",
        "hist1":hist1,
        "hist2":hist2,
    }
    context["islogged"]=islogged
    context["user"]=user
    if(islogged):
        hist=userHistory.objects.filter(name=user).order_by('created_at')
        count=hist.count()
        loop=min(2,count)
        for i in range(loop):
            if(i==0):
                hist1=hist[count-i-1].history
                context["hist1"]=hist1
            else:
                hist2=hist[count-i-1].history
                context["hist2"]=hist2
        context["url"]="logout"
        context["signin"]="Logout"
    return render(request,"index.html",context)


def History(request):
    global hist1,hist2
    if(islogged==0):
        return redirect("/")
    if (request.method=="POST"):
            data = json.loads(request.body)
            name=user
            history=data.get("history")
            answer=data.get("answer")
            userhistory=userHistory(name=name,history=history,answer=answer)
            userhistory.save()
            hist2=hist1
            hist1=history
            return JsonResponse({'status': 'success', 'history': history, 'user': user})
    hist=userHistory.objects.filter(name=user)
    context={
         "hist":hist,
         "user":user,
    }
    return render(request,"history.html",context)
