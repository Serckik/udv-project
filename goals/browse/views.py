from django.shortcuts import render


def browse(request):
    return render(request, 'browse/browse.html')
