from cloudinary_storage.storage import MediaCloudinaryStorage
from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    feedback = models.TextField(max_length=250, blank=False, default="Please add feedback")
    # avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', storage=MediaCloudinaryStorage())
    
    def __str__(self):

        return self.user.username
