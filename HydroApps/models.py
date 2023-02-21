from django.contrib.gis.db import models


class HydroApps(models.Model):
    name = models.CharField(
        max_length=20, 
        unique=True, 
        primary_key=True, 
        help_text="The URL to the welcome page of this app.")
    order = models.IntegerField(
        default=1,
        help_text="A number to set the ordering on the front page.")
    short_explanation_en = models.CharField(
        max_length=500, help_text="A short explanation of this app in english.")
    short_explanation_de = models.CharField(
        max_length=500, help_text="A short explanation of this app in german.")
    home_url = models.CharField(
        max_length=100, 
        help_text="The django URL-dispatcher-name or real URL to the welcome page of this app. E.g. 'weatherDB:home'")
    logo_url = models.CharField(
        max_length=100, 
        help_text="The django static URL-name where to find the logo of this App. E.g. 'logos_other_sites/Logo_NatUrWB.png'")
    is_released = models.BooleanField(
        help_text="Should this app already be shown to the public?")
    is_external = models.BooleanField(
        help_text="Is this app hosted externally?")
    
    class Meta:
        ordering=["order", "name"]