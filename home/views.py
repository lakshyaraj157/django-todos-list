from django.shortcuts import render
from api.models import Todo

# Create your views here.
def index(request):
    todos = Todo.objects.all()
    context = {'todos': todos}
    return render(request, "index.html", context)