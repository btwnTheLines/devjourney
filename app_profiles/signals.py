from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile

#This functions is triggered when a new user is saved
@receiver(post_save, sender=User)

def create_user_profile(sender, instance, created, **kwargs):
    """
    Auto-create a Profile when a new User is created.
    - sender: model that triggered the signal (User)
    - instance: the User instance that was saved
    - created: Trrue if a new User was created
    """
    if created:
        Profile.objects.create(user=instance)