from django.db import models

class App(models.Model):
    name = models.CharField(max_length=100, unique=True, primary_key=True)
    description = models.TextField(max_length=300)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "App"
        verbose_name_plural = "Apps"