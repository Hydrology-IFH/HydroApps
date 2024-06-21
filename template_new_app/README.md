# New App template

This is a template for creating a new HydroApps-Django app. It includes a basic structure for the app, as well as a few useful utilities.

Please copy the template and rename it to your `app_name`. Change all instances of `app_name` to the name of your app.

Here is a short overview of the settings, configurations, files and folders that you should change or add to create a new app:

## Settings

Furthermore you will have to change some settings in the `main\settings.py` file of the project. Those are explained here:

- add the app `app_name` (your app name) to the `INSTALLED_APPS` list
- add the app to the `APPS_ALT_NAMES` dictionary
- If your app shouldn't be released at the begining you should also add it to `APPS_UNRELEASED` list and make sure your views contain the `@unreleased` decorator

Those should be the only changes you need to make to the settings file.

## URLs

You have to add the app to the `urls.py` file of the main HydroApps settup. You can do this by adding `path("app_name/", include("app_name.urls"))` inside the `**i18n_patterns()` part of `urlpatterns` in `main\urls.py`.

## Internationalization (i18n)

The template includes a basic setup for internationalization. You can load 'i18n' in your templates and use the `trans` tag or `blocktrans` to mark string that should be translated. The convention was to use the english text as the key for the translation.

By using `python manage.py makemessages -l de` you can create a new translation file for the german language. Those are located in `app_name\locale\de\LC_MESSAGES\django.po`. Inside those you can set the german translation.

After you translated the strings you can compile the messages with `python manage.py compilemessages`.

Have a look at the [Django documentation](https://docs.djangoproject.com/en/5.0/topics/i18n/translation/) for more information.

## Models

If you use django Models, you should create a `models.py` file in your app and define your models there. You can use the `python manage.py makemigrations` and `python manage.py migrate` commands to create and apply the migrations. 

Have a look at the [Django documentation](https://docs.djangoproject.com/en/5.0/topics/migrations/) for more information.

## static_data

The `static_data` folder is used to store static data that is used in the app. Those can be large files or data that is used in the app, that shouldn't be stored in the git repository.

If you have such data, please put it in the `static_data` folder.

In production is served by the webserver and in development it is served by the django development server.

## development

To test and develop the app you can use the `python manage.py runserver` command to start the development server. You then can access the app at `http://localhost:8000/app_name/`.

## sitemaps

If you want to add a sitemap to your app you can customize the `sitemaps.py` file. You can then add the sitemap to the `sitemaps` dictionary in the `main\sitemaps.py` file.

Sitemaps are used by search engines to index your site. Have a look at the [Django documentation](https://docs.djangoproject.com/en/5.0/ref/contrib/sitemaps/) for more information.

## Logo

Customize your Logo inside `app_name\static\app_name\img\`.

## Templates

You can customize the templates of your app by adding them to the `app_name\templates\app_name` folder. 
They should all extend the `base_template` which points to `app_name\templates\base.html` and which extends the base `base.html` template that is located in the `main\templates` folder. Customize your `app_name\templates\base.html` template to include your logo, favicon and other basic customizations for your app.