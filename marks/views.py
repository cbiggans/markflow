from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import Mark
from .json_parsers.marks import mark_mapping_to_json
import json

# Create your views here.
def index(request):
    latest_marks = Mark.objects.order_by('-created_at')[:5]
    template = loader.get_template('marks/index.html')
    context = {
        'latest_marks': latest_marks,
    }
    return HttpResponse(template.render(context, request))

def details(request, mark_id):
    mark = Mark.find(mark_id)

    mark_mapping = mark_mapping_to_json(mark.mapping())

    context = {
        "mark_mapping": json.dumps(mark_mapping),
    }
    return render(request, 'marks/details.html', context)

def update(request, mark_id):
    mark = Mark.find(mark_id)

    return
