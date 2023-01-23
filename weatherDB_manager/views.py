# from django.http import HttpResponse # static http page
from django.shortcuts import render
from .models import MetaN, TSDownloads, CacheHCaptchaTest
import json
from django.core.serializers import serialize
from django.http import Http404, HttpResponse
from .classes.weatherDB.stations import GroupStations
from .classes.weatherDB.lib.utils import TimestampPeriod
from .forms import HCaptchaForm
from main.settings import DEBUG
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from pathlib import Path
from distutils.util import strtobool
import warnings
import re
import datetime
from django.utils import timezone

CONTEXT_BASE = {
    "debug": DEBUG,
    "active_app": "weatherDB"
}

app_dir = Path(__file__).parent

# get method html
# create html from Markdown 
# open Markdown file in VS Code, then ctrl+shft+P 
# > "Markdown All in One: print current document to html"
with open(app_dir.joinpath("markdown/Methode.html"), "r", encoding="utf8") as f:
    METHOD = re.sub(
        r'(<link.*?href="https:\/\/cdn\.jsdelivr\.net\/.*?markdown\.css.*?>)'+
        r'|(\.alert.*?\s{(.|\n)*?})',
        "", f.read()) 

def get_max_downloads(request):
    if request.user.is_authenticated and request.user.is_active:
        return request.user.max_downloads
    else:
        return 10
 
# Create your views here.
def home(request, *args, **kwargs):
    context = CONTEXT_BASE
    return render(request, "weatherDB\home.html", context)


def get_ts(request, *args, **kwargs):
    context = CONTEXT_BASE.copy()
    context.update({
        'meta_n': json.loads(serialize("geojson", MetaN.objects.all())),
        "max_downloads": get_max_downloads(request)
        })

    # new
    if not (request.user.is_authenticated and request.user.is_active):
        context.update({
            "needs_captcha": True,
            "hcaptchaform": HCaptchaForm()})
    else:
        context.update({"needs_captcha": False})

    return render(request, "weatherDB\get_ts.html", context)

@csrf_protect
def download_ts(request, *args, **kwargs):
    gstats = GroupStations()

    if request.method == "POST":
        if not (request.user.is_authenticated and request.user.is_active): # captcha only needed when not an active user
            hcaptcha_cache = CacheHCaptchaTest.objects.filter(
                csrf_token__exact=request.POST["csrfmiddlewaretoken"],
                timestamp__gt=timezone.make_aware(
                    datetime.datetime.now()-datetime.timedelta(minutes=10)))
            if len(hcaptcha_cache)==0:
                hcaptchaform = HCaptchaForm(request.POST)
                if not hcaptchaform.is_valid():
                    raise Http404("Your Captcha was not correct.")
                else:
                    CacheHCaptchaTest.objects.create(
                        csrf_token=request.POST["csrfmiddlewaretoken"]).save()
    else:
        return Http404("This was not a Post request.")

    # get input parameters
    stids = [
        int(el.replace(" ", ""))
        for el in request.POST["station_ids"].split(",")]
    if not gstats._check_stids(stids):
        raise Http404("You selected stations that are not in the Database")

    max_downloads = get_max_downloads(request)
    if len(stids)>max_downloads:
        raise Http404(f"Only {max_downloads} stations are allowed at once")

    period = TimestampPeriod(
        start=request.POST["period_start"],
        end=request.POST["period_end"])

    if "split_date" in request.POST:
        split_date = bool(strtobool(request.POST["split_date"]))
    else:
        split_date = True

    if "kind" in request.POST:
        kind=request.POST["kind"]
    else:
        kind="best"

    if "aggregation" in request.POST:
        agg_to = request.POST["aggregation"]  
    else:
        agg_to = "day"

    if "add_filled_by" in request.POST:
        add_filled_by = bool(strtobool(request.POST["add_filled_by"]))
    else:
        add_filled_by = False

    if "add_na_share" in request.POST:
        add_na_share = bool(strtobool(request.POST["add_na_share"]))
    else:
        add_na_share = False

    # set kinds
    if add_filled_by:
        kinds = [kind]+["filled_by"]
    else:
        kinds=[kind]

    nas_allowed = kind in ["raw", "qc"] 

    para_dict = dict(
        stids=stids, 
        period_start=period[0], 
        period_end=period[1],
        split_date=split_date,
        kinds=kinds,
        aggregation=agg_to,
        add_na_share=add_na_share)

    # period = TimestampPeriod(
    #         start=form.cleaned_data["period_start"],
    #         end=form.cleaned_data["period_end"])
    # nas_allowed = form.cleaned_data["kind"] in ["raw", "qc"]

    # create a temporary zip folder with timeseries
    # para_dict = form.get_para_dict()
    existing_url = TSDownloads.get_cached_file(**para_dict)
    if existing_url:
        return HttpResponse(existing_url)
    else:
        temp_zf = TSDownloads.create_file(request=request, **para_dict)
        warnings.simplefilter("ignore")
        gstats.create_ts(
                dir=temp_zf.get_fp(),
                period=period,
                kinds=kinds,
                stids=stids,
                agg_to=agg_to,
                r_r0=None,
                split_date=split_date, 
                add_na_share=add_na_share, 
                nas_allowed=nas_allowed)
        # gstats.create_ts(
        #             dir=temp_zf.get_fp(),
        #             period=period,
        #             kinds=form.cleaned_data["kinds"],
        #             stids=form.cleaned_data["stids"],
        #             agg_to=form.cleaned_data["aggregation"],
        #             r_r0=None,
        #             split_date=form.cleaned_data["split_date"], 
        #             add_na_share=form.cleaned_data["add_na_share"], 
        #             nas_allowed=nas_allowed)

    return HttpResponse(temp_zf.get_url())

@login_required
@csrf_protect
def download_secret_settings(request):
    if not request.user.is_active:
        messages.error("Your account is not activated yet")
    else:
        response = HttpResponse(
            content_type='text/py',
            headers={'Content-Disposition': 'attachment; filename="secretSettings_weatherDB.py"'})
        response.writelines([
            "# secret settings for the weatherDB python package #\n",
            "#"*52,
            "\n\n# !!!The database is only available inside the UNI-Freiburg network!!!",
            "# Therefor this package won't work if you are outside of this network.",
            "\n\n# put this file in a parent folder of the python package or some other folder in the PATH or PYTHONPATH environment\n\n",
            "DB_HOST = 'weather.hydro.intra.uni-freiburg.de'\n",
            "DB_PORT = 5432\n",
            "DB_NAME = 'weather'\n",
            "DB_USER = '{}'\n".format(request.user.username),
            "DB_PWD = '{}'\n".format(request.user.db_password)])
        # response['Content-Disposition'] = "attachment; filename=secretSettings.py"
        return response

def method_view(request, *args, **kwargs):
    context = CONTEXT_BASE.copy()
    context.update({"method": METHOD})
    return render(request, "weatherDB\method.html", context)

def package_view(request, *args, **kwargs):
    context = CONTEXT_BASE.copy()
    return render(request, "weatherDB\package.html", context)