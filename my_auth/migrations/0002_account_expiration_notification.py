# Generated by Django 4.2.7 on 2024-02-14 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_auth', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='expiration_notification',
            field=models.DateTimeField(blank=True, default=None, help_text='Designates the date and time when the user got noticed that his account will expire soon.', null=True),
        ),
    ]
