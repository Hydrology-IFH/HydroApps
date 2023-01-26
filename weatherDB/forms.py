from django import forms
from hcaptcha.fields import hCaptchaField
# import warnings
# from .models import TSDownloads
# from .classes.weatherDB.stations import GroupStations
# from .classes.weatherDB.lib.utils import TimestampPeriod
# from django.core.exceptions import ValidationError

class FormDownloadTS(forms.Form):
    hcaptcha = hCaptchaField()
    # stids = forms.CharField(
    #     min_length=1, max_length=None)
    # aggregation = forms.ChoiceField(
    #     choices=["10 min", "hour", "day", "month", "year"],
    #     initial="10 min")
    # period_start = forms.DateField()
    # period_end = forms.DateField()
    # split_date = forms.BooleanField()
    # kind = forms.ChoiceField(choices=["best", "filled", "qc", "raw"])
    # add_filled_by = forms.BooleanField(initial=False)
    # add_na_share = forms.BooleanField(initial=False)

    # def clean_stids(self):
    #     stids = self.cleaned_data["stids"]
    #     gstats = GroupStations()
    #     stids = [
    #         int(el.replace(" ", ""))
    #         for el in self.cleaned_data["stids"].split(",")]
    #     if not gstats._check_stids(stids) or len(stids)>10:
    #         raise ValidationError("Only 10 stations are allowed at once")
        
    #     return stids

    # def clean_kind(self):
    #     kind = self.cleaned_data["kind"]
    #     if self.cleaned_data["add_filled_by"]:
    #         kinds = [kind]+["filled_by"]

    #     return kinds

    # def get_para_dict(self):
    #     return dict(
    #         stids=self.cleaned_data["stids"], 
    #         period_start=self.cleaned_data["period_start"], 
    #         period_end=self.cleaned_data["period_end"],
    #         split_date=self.cleaned_data["split_date"],
    #         kinds=self.cleaned_data["kinds"],
    #         aggregation=self.cleaned_data["aggregation"],
    #         add_na_share=self.cleaned_data["add_na_share"])
    
    # def get_download_url(self):
    #     period = TimestampPeriod(
    #         start=self.cleaned_data["period_start"],
    #         end=self.cleaned_data["period_end"])
    #     nas_allowed = self.cleaned_data["kind"] in ["raw", "qc"]

    #     gstats = GroupStations()
    #     para_dict = self.get_para_dict()

    #     # create a temporary zip folder with timeseries
    #     existing_url = TSDownloads.get_cached_file(**para_dict)
    #     if existing_url:
    #         return existing_url
    #     else:
    #         temp_zf = TSDownloads.create_file(request=request, **para_dict)
    #         warnings.simplefilter("ignore")
    #         gstats.create_ts(
    #                 dir=temp_zf.get_fp(),
    #                 period=period,
    #                 kinds=self.cleaned_data["kinds"],
    #                 stids=self.cleaned_data["stids"],
    #                 agg_to=self.cleaned_data["aggregation"],
    #                 r_r0=None,
    #                 split_date=self.cleaned_data["split_date"], 
    #                 add_na_share=self.cleaned_data["add_na_share"], 
    #                 nas_allowed=nas_allowed)

    #     return temp_zf.get_url()

class HCaptchaForm(forms.Form):
    hcaptcha = hCaptchaField(required=True)