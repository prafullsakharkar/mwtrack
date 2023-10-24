from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

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
from .selectors import get_entities, validate_ids
from .serializers import (
    AssetSerializer,
    EpisodeSerializer,
    NoteListSerializer,
    NoteSerializer,
    ProjectSerializer,
    ReplySerializer,
    SequenceSerializer,
    ShotSerializer,
    StepListSerializer,
    StepSerializer,
    TaskListSerializer,
    TaskSerializer,
    UserTaskSerializer,
    VersionListSerializer,
    VersionSerializer,
)
from .services import bulk_update


class StandardResultsSetPagination(LimitOffsetPagination):
    default_limit = 10
    offset_query_param = "start"
    limit_query_param = "page_size"
    max_limit = 100


class ProjectView(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=True, methods=["post"])
    def asset_bulk_update(self, request, pk=None):
        return Response(bulk_update(Asset, AssetSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def episode_bulk_update(self, request, pk=None):
        return Response(bulk_update(Episode, EpisodeSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def sequence_bulk_update(self, request, pk=None):
        return Response(bulk_update(Sequence, SequenceSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def shot_bulk_update(self, request, pk=None):
        return Response(bulk_update(Shot, ShotSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def step_bulk_update(self, request, pk=None):
        return Response(bulk_update(Step, StepSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def task_bulk_update(self, request, pk=None):
        return Response(bulk_update(Task, TaskSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def user_task_bulk_update(self, request, pk=None):
        return Response(bulk_update(UserTask, UserTaskSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def version_bulk_update(self, request, pk=None):
        return Response(bulk_update(Version, VersionSerializer, pk, request.data))

    @action(detail=True, methods=["post"])
    def note_bulk_update(self, request, pk=None):
        return Response(bulk_update(Note, NoteSerializer, pk, request.data))

    @action(detail=True, methods=["get"])
    def assets(self, request, pk=None):
        return Response(get_entities(Asset, AssetSerializer, request, "project", pk))

    @action(detail=True, methods=["get"])
    def episodes(self, request, pk=None):
        return Response(get_entities(Episode, EpisodeSerializer, request, "project", pk))

    @action(detail=True, methods=["get"])
    def sequences(self, request, pk=None):
        return Response(get_entities(Sequence, SequenceSerializer, request, "project", pk))

    @action(detail=True, methods=["get"])
    def shots(self, request, pk=None):
        return Response(get_entities(Shot, ShotSerializer, request, "project", pk))

    @action(detail=True, methods=["get"])
    def steps(self, request, pk=None):
        return Response(get_entities(Step, StepListSerializer, request, "project", pk))

    @action(detail=True, methods=["get"])
    def tasks(self, request, pk=None):
        return Response(get_entities(Task, TaskListSerializer, request, "project", pk))

    @action(detail=True, methods=["get"])
    def versions(self, request, pk=None):
        return Response(get_entities(Version, VersionSerializer, request, "project", pk))

    @action(detail=True, methods=["get"])
    def notes(self, request, pk=None):
        return Response(get_entities(Note, NoteSerializer, request, "project", pk))


class AssetView(ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = (
        "asset_type",
        "uid",
    )

    filterset_fields = {
        "uid": ["in", "exact"],
        "name": ["in", "exact"],
        "project": ["in", "exact"],
        "asset_type": ["in", "exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(AssetView, self).get_serializer(*args, **kwargs)


class EpisodeView(ModelViewSet):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = (
        "name",
        "description",
    )
    filterset_fields = {
        "uid": ["in", "exact"],
        "name": ["in", "exact"],
        "project": ["exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(EpisodeView, self).get_serializer(*args, **kwargs)

    @action(detail=True, methods=["get"])
    def assets(self, request, pk=None):
        return Response(get_entities(Asset, AssetSerializer, request, "episode", pk))

    @action(detail=True, methods=["get"])
    def sequences(self, request, pk=None):
        return Response(get_entities(Sequence, SequenceSerializer, request, "episode", pk))

    @action(detail=True, methods=["get"])
    def shots(self, request, pk=None):
        return Response(get_entities(Shot, ShotSerializer, request, "episode", pk))

    @action(detail=True, methods=["get"])
    def steps(self, request, pk=None):
        return Response(get_entities(Step, StepSerializer, request, "episode", pk))

    @action(detail=True, methods=["get"])
    def tasks(self, request, pk=None):
        return Response(get_entities(Task, TaskSerializer, request, "episode", pk))

    @action(detail=True, methods=["get"])
    def versions(self, request, pk=None):
        return Response(get_entities(Version, VersionSerializer, request, "episode", pk))

    @action(detail=True, methods=["get"])
    def notes(self, request, pk=None):
        return Response(get_entities(Note, NoteSerializer, request, "episode", pk))


class SequenceView(ModelViewSet):
    queryset = Sequence.objects.all()
    serializer_class = SequenceSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = (
        "name",
        "description",
        "uid",
    )
    filterset_fields = {
        "uid": ["in", "exact"],
        "name": ["in", "exact"],
        "project": ["in", "exact"],
        "episode": ["in", "exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(SequenceView, self).get_serializer(*args, **kwargs)

    @action(detail=True, methods=["get"])
    def assets(self, request, pk=None):
        return Response(get_entities(Asset, AssetSerializer, request, "sequence", pk))

    @action(detail=True, methods=["get"])
    def shots(self, request, pk=None):
        return Response(get_entities(Shot, ShotSerializer, request, "sequence", pk))

    @action(detail=True, methods=["get"])
    def steps(self, request, pk=None):
        return Response(get_entities(Step, StepSerializer, request, "sequence", pk))

    @action(detail=True, methods=["get"])
    def tasks(self, request, pk=None):
        return Response(get_entities(Task, TaskSerializer, request, "sequence", pk))

    @action(detail=True, methods=["get"])
    def versions(self, request, pk=None):
        return Response(get_entities(Version, VersionSerializer, request, "sequence", pk))

    @action(detail=True, methods=["get"])
    def notes(self, request, pk=None):
        return Response(get_entities(Note, NoteSerializer, request, "sequence", pk))


class ShotView(ModelViewSet):
    queryset = Shot.objects.all()
    serializer_class = ShotSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = (
        "name",
        "description",
        "uid",
    )
    filterset_fields = {
        "uid": ["in", "exact"],
        "name": ["in", "exact"],
        "project": ["in", "exact"],
        "episode": ["in", "exact"],
        "sequence": ["in", "exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(ShotView, self).get_serializer(*args, **kwargs)

    @action(detail=True, methods=["get"])
    def assets(self, request, pk=None):
        return Response(get_entities(Asset, AssetSerializer, request, "shot", pk))

    @action(detail=True, methods=["get"])
    def steps(self, request, pk=None):
        return Response(get_entities(Step, StepSerializer, request, "shot", pk))

    @action(detail=True, methods=["get"])
    def tasks(self, request, pk=None):
        return Response(get_entities(Task, TaskSerializer, request, "shot", pk))

    @action(detail=True, methods=["get"])
    def versions(self, request, pk=None):
        return Response(get_entities(Version, VersionSerializer, request, "shot", pk))

    @action(detail=True, methods=["get"])
    def notes(self, request, pk=None):
        return Response(get_entities(Note, NoteSerializer, request, "shot", pk))


class StepView(ModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = ("uid", "name", "status__name", "priority__name")
    filterset_fields = {
        "uid": ["in", "exact"],
        "name": ["in", "exact"],
        "project": ["in", "exact"],
        "episode": ["in", "exact"],
        "sequence": ["in", "exact"],
        "shot": ["in", "exact"],
        "asset": ["in", "exact"],
        "status": ["in", "exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(StepView, self).get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = StepListSerializer
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def tasks(self, request, pk=None):
        return Response(get_entities(Task, TaskSerializer, request, "step", pk))

    @action(detail=True, methods=["get"])
    def versions(self, request, pk=None):
        return Response(get_entities(Version, VersionSerializer, request, "step", pk))

    @action(detail=True, methods=["get"])
    def notes(self, request, pk=None):
        return Response(get_entities(Note, NoteSerializer, request, "step", pk))


class TaskView(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = (
        "uid",
        "name",
        "status__name",
        "priority__name",
        "reviewer__username",
    )
    filterset_fields = {
        "uid": ["in", "exact"],
        "project": ["in", "exact"],
        "episode": ["in", "exact"],
        "sequence": ["in", "exact"],
        "shot": ["in", "exact"],
        "step": ["in", "exact"],
        "asset": ["in", "exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(TaskView, self).get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = TaskListSerializer
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def versions(self, request, pk=None):
        return Response(get_entities(Version, VersionSerializer, request, "task", pk))

    @action(detail=True, methods=["get"])
    def notes(self, request, pk=None):
        return Response(get_entities(Note, NoteSerializer, request, "task", pk))

    @action(detail=True)
    def user_tasks(self, request, pk=None):
        return Response(get_entities(UserTask, UserTaskSerializer, request, "task", pk))


class UserTaskView(ModelViewSet):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    filterset_fields = {
        "user": ["in", "exact"],
        "step": ["in", "exact"],
        "task": ["in", "exact"],
        "project": ["in", "exact"],
        "status": ["in", "exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(UserTaskView, self).get_serializer(*args, **kwargs)


class VersionView(ModelViewSet):
    queryset = Version.objects.all()
    serializer_class = VersionSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = (
        "uid",
        "name",
        "status__name",
        "description",
        "created_by__username",
    )
    filterset_fields = (
        "step",
        "project",
        "shot",
        "asset",
        "task",
        "episode",
        "sequence",
        "media_files",
    )

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(VersionView, self).get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = VersionListSerializer
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def notes(self, request, pk=None):
        return Response(get_entities(Note, NoteSerializer, request, "version", pk))


class NoteView(ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    pagination_class = StandardResultsSetPagination

    ordering_fields = "__all__"
    search_fields = ("message", "step__uid", "created_by__username")

    filterset_fields = {
        "project": ["in", "exact"],
        "asset": ["in", "exact"],
        "episode": ["in", "exact"],
        "sequence": ["in", "exact"],
        "shot": ["in", "exact"],
        "asset": ["in", "exact"],
        "step": ["in", "exact"],
        "task": ["in", "exact"],
        "version": ["in", "exact"],
    }

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(NoteView, self).get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = NoteListSerializer
        return super().list(request, *args, **kwargs)


class ReplyView(ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

    filter_backends = (DjangoFilterBackend,)
    filterset_fields = {"id": ["in", "exact"]}

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(ReplyView, self).get_serializer(*args, **kwargs)
