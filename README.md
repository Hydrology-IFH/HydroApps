# Hydro-Apps

[![pipeline status](https://gitlab.rz.uni-freiburg.de/hydrology/hydroapps/badges/master/pipeline.svg)](https://gitlab.rz.uni-freiburg.de/hydrology/hydroapps/-/commits/master)

This is a django Website of different Hydrological Applications created by the department of hydrology at the University of Freiburg. 
The Website is hosted on [apps.hydro.uni-freiburg.de](https:\\\\apps.hydro.uni-freiburg.de)

## development informations

The repository consists of a "normal" django setup with: 

- `main`: for the main django project settings
- `HydroApps`: folder for the django app that is creating the basic structure of the website like the welcome page with the app selection menu
- an app folder for each of the Hydroapps. Those are standard django apps, with their specific folder structure.
- `template_new_app`: This is an empty template if you want to create a new app. Just copy this folder and rename it to the name of your new app.
- `front-end`: Inside of this folder is tha node front-end devellopment environment. So for every app where node is used to create the front-end, there is a sub-folder with the name of the app under `front-end\src\`.

Furthermore there is a `static_data` folder that is not syncronised with `git`, as this folder is very big. Inside of this folder you will find a subfolder for each app, where the massive static data like tifs and pdfs of the app are stored.

### Installation

To install the project you need to have python and node installed on your system.

First you need to install the python dependencies. You can do this by running the following command in the main repository folder:

```bash
pip install -r requirements.txt
```

Furthermore you will need a postgresql database. The database credentials need to be set in the `.\secretSettings_HydroApps.py` file. You will find a template of this file in the main repository folder (`.\secretSettings_HydroApps.py.template`) and can copy and rename it to `.\secretSettings_HydroApps.py`.

If you setup a completly new database you will need to run the following commands to create the database and the tables:

```bash
python manage.py migrate
```

### run debug server

To run the debug server you need to run the following commands:

```bash
python manage.py runserver --node-dev --open-browser
```

### Internationalization

There are two levels of internationalization in this project. The first level is the internationalization of the django project itself. This is done by the django `i18n` module. So in each django-app folder there is a `locale` folder with the `*.po` files where the translations are stored.
For this internationalization the key is always the english text and only the german translations are stored in the `*.po` files.

The second level is the internationalization of the node front-end. This is done by the `i18next` library. The translations are stored in the `front-end\src\__appp_name__\locales` folders of the front-end. Here the key is a cryptic string and there is one locale file for english and one for german. The translations are stored in the `*.json` files.

If you change the internationalization keys in the source code you will have to recreate the `*.po` files and the `*.json` files. This is done by the following django command and will recreate the locales of django and the fron-end simultaniously:

```bash
python manage.py makemessages -l de
```