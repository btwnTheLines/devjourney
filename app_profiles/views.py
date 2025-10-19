from .forms import LoginForm, SignUpForm, ProfileForm, UserForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.contrib import messages #Flashes success/error messages to the template
from django.http import JsonResponse
from .models import Profile

# Create your views here.
@login_required(login_url='home')
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

@require_POST
def login_view(request):
    """
    Handles AJAX login requests.
    - Validates credentials using authenticate()
    - Logs in user and returns JSON success response
    - If invalid, returns JSON error message
    """
    form = LoginForm(request.POST)
    if form.is_valid():
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Login successful'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid username or password'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid form submission'})


@login_required
@require_POST
def logout_view(request):
    """
    Handles AJAX logout requests.
    """
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})



