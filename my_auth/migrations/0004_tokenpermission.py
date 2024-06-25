# Generated by Django 5.0.2 on 2024-04-19 09:40

import my_auth.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_auth', '0003_permissionclass_remove_account_is_tester_permission_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='TokenPermission',
            fields=[
                ('token', models.CharField(default=my_auth.models.TokenPermission.get_default_token, max_length=60, primary_key=True, serialize=False)),
                ('description', models.TextField(max_length=300)),
                ('valid_until', models.DateTimeField(default=my_auth.models.TokenPermission.get_default_valid_until)),
                ('permissions', models.ManyToManyField(blank=True, default=None, to='my_auth.permission')),
            ],
            options={
                'verbose_name': 'Token Permission',
                'verbose_name_plural': 'Token Permission',
                'db_table_comment': 'Permissions granted via a token to be used for a limited time to access the Hydro-Apps.',
            },
        ),
    ]