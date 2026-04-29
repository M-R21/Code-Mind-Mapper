from django.contrib import admin
from .models import Post, Category, Tag, Author

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author')

admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Author)
