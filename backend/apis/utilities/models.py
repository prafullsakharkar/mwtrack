# /api/server/apis/utility/models.py
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
