from cloudinary_storage.storage import MediaCloudinaryStorage
from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    feedback = models.TextField(max_length=400, blank=False, default="Please add feedback")
    # avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    avatar = models.ImageField(
        upload_to='avatars/', 
        blank=True, 
        null=True, 
        storage=MediaCloudinaryStorage(), 
        default="https://res.cloudinary.com/thewebapp/image/upload/v1657375361/media/profile_images/blank.webp"
    )
    
    def __str__(self):

        return self.user.username
