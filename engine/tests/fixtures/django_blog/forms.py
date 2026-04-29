from django import forms
from .models import Post, Comment

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'body']

class SearchForm(forms.Form):
    query = forms.CharField(max_length=100)
