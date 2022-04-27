from .models import Todo
from django.http import JsonResponse
from .serializers import TodoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def getTodos(request):
    todos = Todo.objects.all()
    serializer = TodoSerializer(todos, many=True)
    return Response({'todos': serializer.data})

@api_view(['GET'])
def getTodo(request, uid):
    todo = Todo.objects.filter(uid=uid).first()
    serializer = TodoSerializer(todo, many=False)
    return Response({'todo': serializer.data})

def submit(request):
    if request.method == "POST":
        uid = request.POST.get("uid")
        title = request.POST.get("title")
        description = request.POST.get("description")

        if not title or not description:
            return JsonResponse({"status": "error", "message": "Please add the details of your todo!"})
        
        elif len(title) < 5 or len(description) < 10:
            return JsonResponse({"status": "error", "message": "This todo is invalid!"})

        else:
            if not uid:
                todo = Todo(title=title, description=description)
                todo.save()
                return JsonResponse({"status": "success", "message": "Your todo has been added successfully!"})
            else:
                todo = Todo.objects.filter(uid=uid).first()
                todo.title = title
                todo.description = description
                todo.save()
                return JsonResponse({"status": "success", "message": "Your todo has been updated successfully!"})
    else:
        return JsonResponse({"BadRequest": {"status": 400, "requestType": str(request.method).lower()}, "Message": "{} request is not allowed on this url!".format(str(request.method).lower())})

def delete(request):
    if request.method == "POST":
        uid = request.POST.get("uid")

        todo = Todo.objects.filter(uid=uid).first()
        todo.delete()
        return JsonResponse({"status": "success", "message": "Your todo has been deleted successfully!"})
    else:
        return JsonResponse({"BadRequest": {"status": 400, "requestType": str(request.method).lower()}, "Message": "{} request is not allowed on this url!".format(str(request.method).lower())})