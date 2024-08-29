from django.db import models
from django.contrib.auth.models import User

# makemigrations=create changes and store in a file
# migrate = apply the pending changes created by makemigrations

# Create your models here.
class login(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE,null=True,blank=True)
    name=models.CharField(max_length=122,unique=True)
    password=models.CharField(max_length=122)
    def __str__(self):
        return self.name
#history
class userHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True,blank=True)
    name=models.CharField(max_length=122)
    history=models.TextField()
    answer=models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        if userHistory.objects.filter(user=self.user).count() >= 10:
            # Delete the oldest row
            oldest = userHistory.objects.filter(user=self.user).order_by('created_at').first()
            oldest.delete()
        super().save(*args, **kwargs)
