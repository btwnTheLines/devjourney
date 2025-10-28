from django.contrib.auth.forms import UserCreationForm # built-in Django signup form
from django.contrib.auth import get_user_model # safer than importing User directly
from django.contrib.auth.models import User
from .models import Profile
from django import forms

User = get_user_model() # get the active User model (in case you swap it later)

class SignUpForm(UserCreationForm):
    #Add extra fields to he default signup form
    email = forms.EmailField(required=True)
    avatar = forms.ImageField(required=False)

    class Meta:
        # Tell Django which models the forms saves to
        model = User

        # Which fields to show in the form - order matters
        fields = ("username", "email", "first_name", "last_name", "password1", "password2")

    def save(self, commit=True):
        """
        Override the default save method:
        - Save User
        - Attach avatar to Profile (created by signals.py)
        """

        user = super().save(commit=False) # create User object but don't save yet
        user.email = self.cleaned_data.get('email') #add email value

        if commit: #only saves if the commit is true
            user.save() #save user to DB
            avatar = self.cleaned_data.get('avatar')
            if avatar:
                #Profile was already created by the signal when User was saved
                profile = user.profile
                profile.avatar = avatar #set uploaded image to profile
                profile.save()
        
        return user

#form for editing basic user info
class UserForm(forms.ModelForm):
    """Form for editing basic user information."""
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


#form for editing profile info (avatar + feedback)
class ProfileForm(forms.ModelForm):
    """Form for editing profile-specific information (avatar + feedback)."""

    class Meta:
        model = Profile
        fields = ['avatar', 'feedback']

class LoginForm(forms.Form):
    """
    Simple login form for username and password.
    We'll use it in the modal (not as a full template).
    """
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'placeholder': 'Username',
            'class': 'w-full px-3 py-2 border rounded-md text-black'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Password',
            'class': 'w-full px-3 py-2 border rounded-md text-black'
        })
    )
