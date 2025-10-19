# --- existing imports and code remain the same ---

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
