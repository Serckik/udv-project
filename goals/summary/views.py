from django.shortcuts import render

def summary(request):
    return render(request, 'summary/summary.html')