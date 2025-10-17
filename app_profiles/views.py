from django.shortcuts import render, redirect
from django.contrib.auth import login #helper to log in user after signup
from django.contrib.auth.decorators import login_required
from django.contrib import messages #Flashes success/error messages to the template
from .models import Profile
from .forms import SignUpForm, ProfileForm, UserForm

# Create your views here.
def profiles_list(request):
    """
    Display all profiles in the database
    """
    profiles = Profile.objects.all()
    return render(request, 'app_profiles/profiles_list.html', {'page_id': 'profiles', 'profiles': profiles})

def index(request):
    """
    Displays home page
    """
    return render(request, 'app_profiles/index.html', {'page_id': 'home'})

def signup(request):
    """
    Display sign up page

    Handles user signups:
    - GET = Shows empoty form, ready for sign up
    - POST = Processes form, creates user + profile, logs user in
    """
    if request.method == "POST": #user submitted the form
        #bind data + files (avatar upload)
        form = SignUpForm(request.POST, request.FILES)

        if form.is_valid(): # validate fields and passwords
            user = form.save() # create User + attach avatar to Profile
            login(request, user) #auto-login after signup
            messages.success(request, "Welcome, your account has been created.")
            return redirect('home') #Go to profiles page
        else:
            # If form is invalid, render the template with errors
            return render(request, 'app_profiles/signup.html', {'form': form, 'page_id': 'signUp'})
    else:
        form = SignUpForm() #empty form for GET requests
        return render(request, 'app_profiles/signup.html', {'form': form, 'page_id': 'signUp'})

@login_required
def edit_profile(request):
    """
    Displays user profile

    Handles user profile edits
    - GET = shows the current values of the user data
    - POST = Change the user data
    """

    user = request.user
    profile = user.profile

    if request.method == 'POST':
        user_form = UserForm(request.POST, instance=user)
        profile_form = ProfileForm(request.POST, request.FILES, instance=profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('profiles_list')  # You can replace this with your own URL name
    else:
        user_form = UserForm(instance=user)
        profile_form = ProfileForm(instance=profile)

    return render(request, 'app_profiles/edit_profile.html', {
        'user_form': user_form,
        'profile_form': profile_form,
    })