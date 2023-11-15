# Generated by Django 4.2 on 2023-11-09 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=60, unique=True, verbose_name='email address')),
                ('username', models.CharField(max_length=60, unique=True)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('date_joined', models.DateTimeField(auto_now_add=True, verbose_name='date_joined')),
                ('last_login', models.DateTimeField(auto_now=True, verbose_name='last login')),
                ('personal_introduction', models.TextField(help_text='Comment of the user why he/she should have access to the Hydro-Apps', max_length=300)),
                ('confirmed_data_policy', models.BooleanField(help_text='Designates whether the user confirmed the data policy agreement.', verbose_name='I agree to the terms of usage of my data and I did read and agree to the policy agreement of this website.')),
                ('is_email_confirmed', models.BooleanField(default=False, help_text="Designates whether the user confirmed it's e-mail address.")),
                ('is_active', models.BooleanField(default=False, help_text='Designates whether the user got activated by a super user.')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.')),
                ('is_tester', models.BooleanField(default=False, help_text="Designates whether the user can see features that didn't yet get released.")),
                ('wdb_is_db_user', models.BooleanField(default=False, help_text='Designates whether the user can log into the WeatherDB-database.')),
                ('wdb_max_downloads', models.IntegerField(default=10, help_text='Designates the number of stations a user can download at once on the WeatherDB App.')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates whether the user is superuser.')),
                ('db_password', models.CharField(blank=True, help_text='The Password for this user to log into the database.', max_length=30, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
