from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post

@receiver(post_save, sender=Post)
def notify_author(sender, instance, created, **kwargs):
    if created:
        print(f"Notifying author {instance.author.name} about new post {instance.title}")
