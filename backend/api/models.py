from django.db import models
from django.contrib.auth.models import User
import uuid






class SystemAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="analyses")
    task_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    title = models.CharField(max_length=255)
    description = models.TextField()

    result = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default="processing")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"


