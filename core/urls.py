from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('solucoes/', views.solucoes_view, name='solucoes'),
    path('contact/', views.contact_form_view, name='contact'),
]