# from django.http import HttpResponse
# from django.core.serializers import serialize
# from .models import get_ts_model
# from .serializers import TSSerializer
# from rest_framework.renderers import JSONRenderer

# def get_ts_api(request, *args, **kwargs):
#     if "stat_id" in request.GET:
#         model = get_ts_model(request.GET["stat_id"])
#         qs = model.objects.all()
#         # data = serialize("json", qs)
#     # return HttpResponse(data, content_type="application/json")
#         serializer = TSSerializer(qs, many=True)
#         print(serializer.data)
#         json = JSONRenderer().render(serializer.data)
#     return HttpResponse(json, content_type="application/json")