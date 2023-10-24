import datetime
import os
from uuid import uuid4

from apis.utilities.models import FileUpload, Status
from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models

User = settings.AUTH_USER_MODEL


class BaseFields(models.Model):
    id = models.BigIntegerField(auto_created=True, serialize=False, verbose_name="ID", null=True)
    uid = models.CharField(primary_key=True, max_length=255, default=None)
    name = models.CharField(max_length=200, blank=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    REQUIRED_FIELDS = ["name"]

    class Meta:
        abstract = True
        ordering = ["uid"]


def get_project_thumbnail_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{instance.code}.{ext}" if instance.code else f"{uuid4().hex}.{ext}"
    return os.path.join("project_pics", filename)


class Project(BaseFields):
    code = models.CharField(
        max_length=5,
        unique=True,
        blank=False,
        validators=[RegexValidator("^[A-Z0-9]*$", "only UPPERCASE letter are allowed")],
    )
    cg_supervisor = models.ForeignKey(
        to=User, null=True, on_delete=models.SET_NULL, related_name="cg_supervisor"
    )
    start_date = models.DateField(auto_now_add=True, null=True)
    entity_type = models.CharField(max_length=20, default="Project")
    duration = models.IntegerField(default=1)
    due_date = models.DateField(null=True)
    resolution = models.CharField(
        max_length=9,
        validators=[RegexValidator("^\d{1,4}X\d{1,4}$", "Enter valid resolution")],
    )
    start_frame = models.IntegerField(default=101)
    fps = models.FloatField(default=24.0)
    is_episodic = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    thumbnail = models.ImageField(
        default="defaults/project_pic.png", upload_to=get_project_thumbnail_path
    )
    users = models.ManyToManyField(to=User, blank=True)

    REQUIRED_FIELDS = ["code"]

    def __str__(self):
        return f"Project: {self.uid}"

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = self.code.lower()
        super(Project, self).save(*args, **kwargs)


class Asset(BaseFields):
    asset_type_choice = (
        ("Fx", "Fx"),
        ("Set", "Set"),
        ("Vehicle", "Vehicle"),
        ("Prop", "Prop"),
        ("Character", "Character"),
        ("NA", "NA"),
    )

    asset_type = models.CharField(max_length=10, choices=asset_type_choice, default="NA")
    entity_type = models.CharField(max_length=20, default="Asset")
    prefix = models.CharField(max_length=250, blank=True)
    client_name = models.CharField(max_length=250, blank=True)
    description = models.TextField(max_length=100, blank=True)

    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"Asset: {self.uid}"

    @property
    def steps(self):
        return self.step_set.all()

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = self.project.uid + ":" + self.name
        super(Asset, self).save(*args, **kwargs)


class Episode(BaseFields):
    description = models.TextField(null=True, blank=True)
    entity_type = models.CharField(max_length=20, default="Episode")
    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    assets = models.ManyToManyField(to=Asset, blank=True, default=[])

    def __str__(self):
        return f"Episode: {self.uid}"

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = self.project.uid + ":" + self.name

        super(Episode, self).save(*args, **kwargs)


class Sequence(BaseFields):
    description = models.TextField(max_length=100, blank=True)
    entity_type = models.CharField(max_length=20, default="Sequence")

    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    episode = models.ForeignKey(to=Episode, null=True, on_delete=models.CASCADE)
    assets = models.ManyToManyField(to=Asset, blank=True, default=[])

    def __str__(self):
        return f"Sequence: {self.uid}"

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = (
                (
                    self.episode.uid + ":" + self.name
                    if self.episode
                    else self.project.uid + ":" + self.name
                )
                if self.project.is_episodic
                else self.project.uid + ":" + self.name
            )

        super(Sequence, self).save(*args, **kwargs)


class Shot(BaseFields):
    description = models.TextField(max_length=100, blank=True)
    entity_type = models.CharField(max_length=20, default="Shot")
    start_frame = models.IntegerField(default=101)
    end_frame = models.IntegerField(default=102)

    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    episode = models.ForeignKey(to=Episode, null=True, on_delete=models.CASCADE)
    sequence = models.ForeignKey(to=Sequence, null=True, on_delete=models.CASCADE)
    assets = models.ManyToManyField(to=Asset, blank=True, default=[])

    def __str__(self):
        return f"Shot: {self.uid}"

    @property
    def steps(self):
        return self.step_set.all()

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = self.sequence.uid + ":" + self.name
        if self.start_frame != self.project.start_frame:
            self.start_frame = self.project.start_frame
        super(Shot, self).save(*args, **kwargs)


class Step(BaseFields):
    entity_type = models.CharField(max_length=20, default="Step")
    status = models.ForeignKey(to=Status, null=True, on_delete=models.SET_NULL)
    start_date = models.DateTimeField(auto_now_add=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now())
    duration = models.IntegerField(default=0)
    retakes = models.PositiveSmallIntegerField(default=0)

    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    asset = models.ForeignKey(to=Asset, null=True, on_delete=models.CASCADE)
    episode = models.ForeignKey(to=Episode, null=True, on_delete=models.CASCADE)
    sequence = models.ForeignKey(to=Sequence, null=True, on_delete=models.CASCADE)
    shot = models.ForeignKey(to=Shot, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"Step: {self.uid}"

    @property
    def bid_days(self):
        return round(sum(self.step_users.values_list("bid", flat=True)) / (8 * 60), 2)

    @property
    def users(self):
        return self.step_users.values_list("user", flat=True)

    @property
    def tasks(self):
        return self.task_set.values_list("uid", flat=True)

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = (
                (
                    self.shot.uid + ":" + self.name
                    if self.shot
                    else self.sequence.uid + ":" + self.name
                )
                if self.sequence
                else self.asset.uid + ":" + self.name
            )

        super(Step, self).save(*args, **kwargs)


class Task(BaseFields):
    PRIORITY_CHOICES = [
        ("low", "low"),
        ("medium", "medium"),
        ("high", "high"),
    ]

    version_number = models.IntegerField(default=1, blank=False)
    entity_type = models.CharField(max_length=15, default="Task")
    status = models.ForeignKey(to=Status, null=True, on_delete=models.SET_NULL)
    priority = models.CharField(max_length=15, choices=PRIORITY_CHOICES, default="low")
    start_date = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now())
    end_date = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now())
    duration = models.IntegerField(default=1)
    reviewer = models.ForeignKey(to=User, null=True, on_delete=models.SET_NULL)

    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    asset = models.ForeignKey(to=Asset, null=True, on_delete=models.CASCADE)
    episode = models.ForeignKey(to=Episode, null=True, on_delete=models.CASCADE)
    sequence = models.ForeignKey(to=Sequence, null=True, on_delete=models.CASCADE)
    shot = models.ForeignKey(to=Shot, null=True, on_delete=models.CASCADE)
    step = models.ForeignKey(to=Step, null=True, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ["version_number", "step"]

    def __str__(self):
        return f"Task: {self.uid}"

    @property
    def users(self):
        return self.task_users.values_list("user", flat=True)

    @property
    def bid_days(self):
        return round(sum(self.task_users.values_list("bid", flat=True)) / (8 * 60), 2)

    def save(self, *args, **kwargs):
        if not self.uid:
            self.name = "Task_v" + str(self.version_number)
            self.uid = self.step.uid + ":" + self.name

        super(Task, self).save(*args, **kwargs)


class UserTask(models.Model):
    bid = models.IntegerField(default=0)
    assign_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField(null=True)
    stop_date = models.DateTimeField(null=True)
    duration = models.IntegerField(default=0)
    status = models.ForeignKey(to=Status, null=True, on_delete=models.SET_NULL)

    user = models.ForeignKey(to=User, null=True, on_delete=models.CASCADE)
    task = models.ForeignKey(
        to=Task, null=True, on_delete=models.CASCADE, related_name="task_users"
    )
    step = models.ForeignKey(
        to=Step, null=True, on_delete=models.CASCADE, related_name="step_users"
    )
    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"UserTask {self.user.username}"


class Version(BaseFields):
    version_number = models.IntegerField(default=1, blank=False)
    status = models.ForeignKey(to=Status, null=True, on_delete=models.SET_NULL)
    entity_type = models.CharField(max_length=20, default="Version")
    media_files = models.ManyToManyField(
        to=FileUpload, blank=True, related_name="review_files", default=[]
    )
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        to=User, related_name="version_created_by", null=True, on_delete=models.SET_NULL
    )
    updated_by = models.ForeignKey(
        to=User, related_name="version_updated_by", null=True, on_delete=models.SET_NULL
    )

    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    asset = models.ForeignKey(to=Asset, null=True, on_delete=models.CASCADE)
    episode = models.ForeignKey(to=Episode, null=True, on_delete=models.CASCADE)
    sequence = models.ForeignKey(to=Sequence, null=True, on_delete=models.CASCADE)
    shot = models.ForeignKey(to=Shot, null=True, on_delete=models.CASCADE)
    step = models.ForeignKey(to=Step, null=True, on_delete=models.CASCADE)
    task = models.ForeignKey(to=Task, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Version {self.uid}"

    def save(self, *args, **kwargs):
        if not self.uid:
            self.name = "Review_v" + str(self.version_number)
            self.uid = self.step.uid + ":" + self.name

        super(Version, self).save(*args, **kwargs)


class Note(models.Model):
    message = models.TextField(blank=False)
    entity_type = models.CharField(max_length=20, default="Note")
    attachments = models.ManyToManyField(to=FileUpload, blank=True, default=[])
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now())
    created_by = models.ForeignKey(
        to=User, related_name="note_created_by", null=True, on_delete=models.SET_NULL
    )
    updated_by = models.ForeignKey(
        to=User, related_name="note_updated_by", null=True, on_delete=models.SET_NULL
    )

    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    asset = models.ForeignKey(to=Asset, null=True, on_delete=models.CASCADE)
    episode = models.ForeignKey(to=Episode, null=True, on_delete=models.CASCADE)
    sequence = models.ForeignKey(to=Sequence, null=True, on_delete=models.CASCADE)
    shot = models.ForeignKey(to=Shot, null=True, on_delete=models.CASCADE)
    step = models.ForeignKey(to=Step, null=True, on_delete=models.CASCADE)
    task = models.ForeignKey(to=Task, null=True, on_delete=models.CASCADE)
    version = models.ForeignKey(to=Version, null=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ["-updated_at"]

    @property
    def replies(self):
        return self.reply_set.all()


class Reply(models.Model):
    message = models.TextField(blank=False)
    entity_type = models.CharField(max_length=20, default="Reply")
    attachments = models.ManyToManyField(to=FileUpload, blank=True, default=[])
    note = models.ForeignKey(to=Note, null=True, on_delete=models.CASCADE)
    project = models.ForeignKey(to=Project, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now())
    created_by = models.ForeignKey(
        to=User, related_name="reply_created_by", null=True, on_delete=models.SET_NULL
    )
    updated_by = models.ForeignKey(
        to=User, related_name="reply_updated_by", null=True, on_delete=models.SET_NULL
    )
