from django.apps import AppConfig


class AppProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_profiles'

    def ready(self):
        #Import signals so they are registered when Django starts
        import app_profiles.signals
