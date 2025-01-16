# from django.http import HttpResponse # static http page
from django.shortcuts import render
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.utils import timezone
from django.db import OperationalError
from django.core.serializers import serialize
from django.http import Http404, HttpResponse
from main.settings import DEBUG
import json
from pathlib import Path
from distutils.util import strtobool
import warnings
import re
import datetime
import pandas as pd

import weatherdb
from weatherdb.stations import GroupStations, StationsP
from weatherdb.utils import TimestampPeriod
from weatherdb.broker import Broker

from .forms import HCaptchaForm
from .models import MetaP, TSDownloads, CacheHCaptchaTest

app_dir = Path(__file__).parent
wdb_broker = Broker()

# get wdb_url
WDB_DB_CONFIG = {
    "db_host": weatherdb.db.db_engine.engine.url.host,
    "db_port": weatherdb.db.db_engine.engine.url.port,
    "db_database": weatherdb.db.db_engine.engine.url.database,
}
statsp = StationsP()

# get method html
# create html from Markdown
# open Markdown file in VS Code, then ctrl+shft+P
# > "Markdown All in One: print current document to html"
with open(app_dir.joinpath("markdown/Methode.html"), "r", encoding="utf8") as f:
    METHOD = re.sub(
        r'(<link.*?href="https:\/\/cdn\.jsdelivr\.net\/.*?markdown\.css.*?>)'+
        r'|(\.alert.*?\s{(.|\n)*?})',
        "", f.read())

def get_wdb_max_downloads(request):
    if request.user.is_authenticated and request.user.is_active:
        return request.user.wdb_max_downloads
    else:
        return 10

# Create your views here.
def home(request, *args, **kwargs):
    return render(request, "weatherdb/home.html", {})


def get_ts(request, *args, **kwargs):
    try:
        quots = pd.concat([statsp.get_quotient("corr", "filled"), statsp.get_quotient("filled", "hyras")])\
            .droplevel("parameter").mul(100).round(1)\
            .reset_index().pivot_table(index="station_id", columns=["kind_num","kind_denom"], values="value")
        quots_json = quots.set_axis(quots.columns.map("_".join), axis=1).to_dict(orient="index")
        context = {
            'meta_p': json.loads(serialize("geojson", MetaP.objects.all())),
            'quots': quots_json,
            "wdb_max_downloads": get_wdb_max_downloads(request),
            "db_version": wdb_broker.get_db_version()
            }
    except OperationalError:
        # when database is down
        return render(request,"weatherdb/db_not_available.html")

    # new
    if not ((request.user.is_authenticated and request.user.is_active) or DEBUG):
        context.update({
            "needs_captcha": True,
            "hcaptchaform": HCaptchaForm()})
    else:
        context.update({"needs_captcha": False})

    return render(request, "weatherdb/get_ts.html", context)

@csrf_protect
def download_ts(request, *args, **kwargs):
    gstats = GroupStations()

    if request.method == "POST":
        if not ((request.user.is_authenticated and request.user.is_active)
                or DEBUG): # captcha only needed when not an active user and not DEBUG
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

    wdb_max_downloads = get_wdb_max_downloads(request)
    if len(stids)>wdb_max_downloads:
        raise Http404(f"Only {wdb_max_downloads} stations are allowed at once")

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

    if "add_t_min" in request.POST:
        add_t_min=bool(strtobool(request.POST["add_t_min"]))
    else:
        add_t_min = False

    if "add_t_max" in request.POST:
        add_t_max=bool(strtobool(request.POST["add_t_max"]))
    else:
        add_t_max=False

    if "toolbox_format" in request.POST:
        toolbox_format=bool(strtobool(request.POST["toolbox_format"]))
    else:
        toolbox_format=False

    # set kinds
    if add_filled_by:
        kinds = [kind]+["filled_by"]
    else:
        kinds=[kind]

    nas_allowed = kind in ["raw", "qc"]
    # temporarily allow all NAs as ET from DWD is not providen anymore
    nas_allowed = True

    para_dict = dict(
        stids=stids,
        period_start=period[0],
        period_end=period[1],
        split_date=split_date,
        kinds=kinds,
        aggregation=agg_to,
        add_na_share=add_na_share,
        add_t_min=add_t_min,
        add_t_max=add_t_max,
        toolbox_format=toolbox_format)

    if toolbox_format:
        file_names = {"N":"PREC.txt", "T":"TA.txt", "ET":"PET.txt"},
        col_names = {"N":"PREC", "ET":"PET",
                    "T":"TA", "T_min":"TA_min", "T_max":"TA_max",
                    "Jahr":"YYYY", "Monat":"MM", "Tag":"DD",
                    "Stunde":"hh", "Minute":"mm"}
        add_header = False
        keep_date_parts = True
    else:
        file_names = {}
        col_names = {}
        add_header = True
        keep_date_parts = False

    # create a temporary zip folder with timeseries
    existing_url = TSDownloads.get_cached_file(**para_dict)
    if existing_url:
        return HttpResponse(existing_url)
    else:
        temp_zf = TSDownloads.create_file(request=request, **para_dict)
        warnings.simplefilter("ignore")
        try:
            gstats.create_ts(
                dir=temp_zf.get_fp(),
                period=period,
                kinds=kinds,
                stids=stids,
                agg_to=agg_to,
                r_r0=None,
                split_date=split_date,
                add_na_share=add_na_share,
                nas_allowed=nas_allowed,
                add_t_min=add_t_min,
                add_t_max=add_t_max,
                file_names=file_names,
                col_names=col_names,
                add_header=add_header,
                keep_date_parts=keep_date_parts,)
        except Exception as e:
            temp_zf.delete()
            raise e

    return HttpResponse(temp_zf.get_url())

@login_required
@csrf_protect
def get_user_config(request):
    if not request.user.is_active:
        messages.error("Your account is not activated yet")
    else:
        context = {
            "db_user": request.user.username,
            "db_password": request.user.db_password,
            **WDB_DB_CONFIG
        }
        if context["db_host"] == "localhost":
            context["db_host"] = request.get_host()
        return render(request, "weatherdb/user_conf.html", context)


def method_view(request, *args, **kwargs):
    context = {"method": METHOD}
    return render(request, "weatherdb/method.html", context)

def package_view(request, *args, **kwargs):
    return render(request, "weatherdb/package.html", {})