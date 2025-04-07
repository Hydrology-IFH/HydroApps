# from django.http import HttpResponse # static http page
from django.views.generic.edit import FormView
from django.shortcuts import render
from django.urls import reverse_lazy

from main.settings import CESIUM_API_KEY
from .forms import FeedbackForm

# Create your views here.
def home_view(request, *args, **kwargs):
    return render(request, "sfi_demo/home.html", {})

def app_view(request, *args, **kwargs):
    return render(request, "sfi_demo/app.html", {"CESIUM_API_KEY": CESIUM_API_KEY})

def method_view(request, *args, **kwargs):
    return render(request, "sfi_demo/method.html", {})

class FeedbackView(FormView):
    template_name = "sfi_demo/feedback.html"
    form_class = FeedbackForm
    success_url = reverse_lazy("sfi_demo:feedback")

    def form_valid(self, form):
        try:
            form.send_email()

            return render(
                self.request,
                self.template_name,
                {"success": True,})
        except Exception as e:
            return render(
                self.request,
                self.template_name,
                {"error": True,})