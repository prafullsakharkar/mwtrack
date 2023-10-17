from rest_framework.viewsets import ModelViewSet

from .models import Asset, Episode, Project, Sequence, Shot, Step, Task, UserTask
from .serializers import (
    AssetSerializer,
    EpisodeSerializer,
    ProjectSerializer,
    SequenceSerializer,
    ShotSerializer,
    StepSerializer,
    TaskSerializer,
    UserTaskSerializer,
)


class ProjectView(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class AssetView(ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class EpisodeView(ModelViewSet):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer


class SequenceView(ModelViewSet):
    queryset = Sequence.objects.all()
    serializer_class = SequenceSerializer


class ShotView(ModelViewSet):
    queryset = Shot.objects.all()
    serializer_class = ShotSerializer


class StepView(ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


class TaskView(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class UserTaskView(ModelViewSet):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer
