from django.contrib import admin
from django.urls import path
from app_profiles import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='home'),
    path('admin/', admin.site.urls),
    path('profiles-list/', views.profiles_list, name='profiles_list'),
    path('signup/', views.signup, name='signup'),
    path('edit_profile/', views.edit_profile, name='edit_profile'),

    # New: AJAX login/logout
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path("account/delete/", views.delete_account, name="account-delete"),
]

# 👇 This is what serves MEDIA files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
