from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.pagination import LimitOffsetPagination
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


class StandardResultsSetPagination(LimitOffsetPagination):
    default_limit = 10
    offset_query_param = "start"
    limit_query_param = "page_size"
    max_limit = 100


class ProjectView(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


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
