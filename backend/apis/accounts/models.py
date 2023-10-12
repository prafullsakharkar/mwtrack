import os
from uuid import uuid4

from django.contrib.auth.models import AbstractUser
from django.db import models
from PIL import Image


def get_file_path(instance, filename):
    ext = filename.split(".")[-1]
    # get filename
    if instance.username:
        filename = "{}.{}".format(instance.username, ext)
    else:
        # set filename as random string
        filename = "{}.{}".format(uuid4().hex, ext)
    # return the whole path to the file
    return os.path.join("profile_pics", filename)


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "admin"),
        ("owner", "owner"),
        ("production", "production"),
        ("supervisor", "supervisor"),
        ("artist", "artist"),
    ]
    avatar = models.ImageField(default="defaults/profile_pic.jpg", upload_to=get_file_path)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="owner")
    email = models.CharField(
        max_length=250,
        unique=True,
        help_text="Required. 250 characters or fewer. Letters, digits and @/./_ only.",
        error_messages={
            "unique": "Email already exists.",
        },
    )

    def __str__(self):
        return f"{self.email}"

    def save(self, *args, **kwargs):
        if not self.username.startswith("MWT"):
            if not self.id:
                self.username = "MWT%0004d" % int(User.objects.count() + 1)
            else:
                self.username = "MWT%0004d" % int(self.id)

        if not self.first_name:
            email = self.email.split("@")[0]
            self.first_name = email.split(".")[0].title()
            self.last_name = email.split(".")[1].title() if len(email.split(".")) > 1 else ""

        super().save(*args, **kwargs)

        img = Image.open(self.avatar.path)

        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.avatar.path)
