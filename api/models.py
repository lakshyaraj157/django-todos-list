from django.db import models
import uuid

# Create your models here.
class Todo(models.Model):
    sno = models.AutoField(primary_key=True)
    title = models.CharField(max_length=1200)
    description = models.CharField(max_length=2500)
    uid = models.UUIDField(default=uuid.uuid4)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)