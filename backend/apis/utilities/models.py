import datetime
import hashlib
import os

from django.db import models


class Status(models.Model):
    name = models.CharField(max_length=100, default="", null=False, blank=False, unique=True)
    color = models.CharField(max_length=100, default="#FFFFFF", unique=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return f"Status: {self.name}"


class UtilStep(models.Model):
    ENTITY_CHOICES = [("Asset", "Asset"), ("Sequence", "Sequence"), ("Shot", "Shot"), ("", "")]

    name = models.CharField(max_length=30, default="", null=False, blank=False, unique=True)
    entity = models.CharField(max_length=20, default="", choices=ENTITY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return f"UtilStep: {self.name}"


def get_file_path(instance, filename):
    created_at = datetime.date.today()
    return os.path.join("upload_files", str(created_at), filename)


class FileUpload(models.Model):
    name = models.CharField(max_length=250, blank=False)
    type = models.CharField(max_length=50, blank=False)
    url = models.FileField(max_length=255, blank=False, upload_to=get_file_path)
    md5sum = models.CharField(max_length=250, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"FileUpload: {self.name}"

    def save(self, *args, **kwargs):
        if not self.md5sum:
            self.md5sum = hashlib.md5(self.url.read()).hexdigest()
        super().save(*args, **kwargs)
