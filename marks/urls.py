from django.urls import path
from . import views

app_name = 'marks'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:mark_id>/', views.details, name='details'),
    path('<int:mark_id>/update', views.update, name='update'),
]
