from rest_framework.serializers import ModelSerializer

from .models import Asset, Episode, Project, Sequence, Shot, Step, Task, UserTask


class ProjectSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        # exclude = ("users",)


class AssetSerializer(ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"


class EpisodeSerializer(ModelSerializer):
    class Meta:
        model = Episode
        fields = "__all__"


class SequenceSerializer(ModelSerializer):
    class Meta:
        model = Sequence
        fields = "__all__"


class ShotSerializer(ModelSerializer):
    class Meta:
        model = Shot
        fields = "__all__"


class StepSerializer(ModelSerializer):
    class Meta:
        model = Step
        fields = "__all__"


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class UserTaskSerializer(ModelSerializer):
    class Meta:
        model = UserTask
        fields = "__all__"
