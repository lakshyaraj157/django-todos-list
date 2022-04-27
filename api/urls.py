from django.urls import path
from . import views

urlpatterns = [
    path('gettodos', views.getTodos, name='getTodos'),
    path('gettodo/<str:uid>', views.getTodo, name='getTodo'),
    path('submit', views.submit, name='submit'),
    path('delete', views.delete, name='delete'),
]
