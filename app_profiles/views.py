from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .forms import LoginForm

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

