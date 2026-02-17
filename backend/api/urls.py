from django.urls import path
from .views import create_request, list_requests, AnalyzeView, AnalyzeResultView , MyAnalysesView
from .views import register_user




urlpatterns = [
    path('create/', create_request),
    path('list/', list_requests), 
    path("analyze/", AnalyzeView.as_view()),
    path("analyze/<str:task_id>/", AnalyzeResultView.as_view()),
    path("my-analyses/", MyAnalysesView.as_view()),
    path('register/',register_user, name='register'),



]
