from django.views.generic import ListView, DetailView, CreateView
from django.shortcuts import render, get_object_or_404
from .models import Post

class PostListView(ListView):
    model = Post

class PostDetailView(DetailView):
    model = Post

class PostCreateView(CreateView):
    model = Post
    fields = ['title', 'body', 'author', 'category', 'tags']

def archive_view(request):
    return render(request, "archive.html", {})

def author_posts_view(request, author_id):
    posts = Post.objects.filter(author_id=author_id)
    return render(request, "author_posts.html", {"posts": posts})
