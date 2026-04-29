from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListView.as_view(), name='post_list'),
    path('post/<int:pk>/', views.PostDetailView.as_view(), name='post_detail'),
    path('post/create/', views.PostCreateView.as_view(), name='post_create'),
    path('archive/', views.archive_view, name='archive'),
    path('author/<int:author_id>/', views.author_posts_view, name='author_posts'),
]
