from apis.accounts.serializers import UserSerializer
from apis.utilities.serializers import FileUploadSerializer, StatusSerializer
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ListSerializer, ModelSerializer

from .models import (
    Asset,
    Episode,
    Note,
    Project,
    Reply,
    Sequence,
    Shot,
    Step,
    Task,
    UserTask,
    Version,
)


class BulkUpdateSerializer(ListSerializer):
    def update(self, instances, validated_data):
        instance_hash = {index: instance for index, instance in enumerate(instances)}
        try:
            result = [
                self.child.update(instance_hash[index], attrs)
                for index, attrs in enumerate(validated_data)
            ]
        except IntegrityError as e:
            raise ValidationError(e)

        return result


class ProjectSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        # exclude = ("users",)


class AssetSerializer(ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"
        read_only_fields = ("uid",)
        list_serializer_class = BulkUpdateSerializer


class EpisodeSerializer(ModelSerializer):
    class Meta:
        model = Episode
        fields = "__all__"
        read_only_fields = ("uid",)
        list_serializer_class = BulkUpdateSerializer


class SequenceSerializer(ModelSerializer):
    class Meta:
        model = Sequence
        fields = "__all__"
        read_only_fields = ("uid",)
        list_serializer_class = BulkUpdateSerializer


class ShotSerializer(ModelSerializer):
    class Meta:
        model = Shot
        fields = "__all__"
        read_only_fields = ("uid",)
        list_serializer_class = BulkUpdateSerializer


class StepSerializer(ModelSerializer):
    class Meta:
        model = Step
        fields = "__all__"
        read_only_fields = ("uid",)
        list_serializer_class = BulkUpdateSerializer


class StepListSerializer(ModelSerializer):
    status = StatusSerializer()

    class Meta:
        model = Step
        fields = (
            "project",
            "uid",
            "bid_days",
            "status",
            "asset",
            "episode",
            "updated_at",
            "users",
            "sequence",
            "shot",
            "created_at",
            "start_date",
            "end_date",
            "duration",
            "retakes",
            "name",
            "tasks",
        )


class UserTaskSerializer(ModelSerializer):
    class Meta:
        model = UserTask
        fields = "__all__"
        read_only_fields = ("id",)
        list_serializer_class = BulkUpdateSerializer


class UserTaskListSerializer(ModelSerializer):
    class CustomStepSerializer(ModelSerializer):
        status = StatusSerializer()

        class Meta:
            model = Step
            fields = ("status", "priority", "uid")

    status = StatusSerializer()
    step = CustomStepSerializer()

    class Meta:
        model = UserTask
        fields = "__all__"


class TaskListSerializer(ModelSerializer):
    status = StatusSerializer()
    reviewer = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = (
            "project",
            "users",
            "uid",
            "bid_days",
            "status",
            "priority",
            "asset",
            "episode",
            "name",
            "sequence",
            "shot",
            "created_at",
            "start_date",
            "end_date",
            "reviewer",
            "duration",
            "step",
        )
        # fields = "__all__"


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ("uid",)
        list_serializer_class = BulkUpdateSerializer


class VersionSerializer(ModelSerializer):
    class Meta:
        model = Version
        fields = "__all__"
        read_only_fields = ("uid",)
        list_serializer_class = BulkUpdateSerializer


class VersionListSerializer(ModelSerializer):
    status = StatusSerializer()
    created_by = UserSerializer()
    media_files = FileUploadSerializer(many=True, read_only=True)
    updated_by = UserSerializer(read_only=True)

    class Meta:
        model = Version
        fields = "__all__"
        # exclude = ('media_files',)


class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"
        read_only_fields = ("id",)
        list_serializer_class = BulkUpdateSerializer


class ReplySerializer(ModelSerializer):
    class Meta:
        model = Reply
        fields = "__all__"
        read_only_fields = ("id",)


class ReplyListSerializer(ModelSerializer):
    attachments = FileUploadSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Reply
        fields = "__all__"


class NoteListSerializer(ModelSerializer):
    attachments = FileUploadSerializer(many=True, read_only=True)
    replies = ReplyListSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Note
        fields = (
            "id",
            "attachments",
            "message",
            "created_at",
            "created_by",
            "replies",
            "step",
            "project",
            "asset",
            "episode",
            "sequence",
            "shot",
            "task",
            "updated_at",
            "updated_by",
        )
