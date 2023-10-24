from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AssetView,
    EpisodeView,
    NoteView,
    ProjectView,
    ReplyView,
    SequenceView,
    ShotView,
    StepView,
    TaskView,
    UserTaskView,
    VersionView,
)

router = DefaultRouter()
router.register(r"projects", ProjectView)
router.register(r"assets", AssetView)
router.register(r"episodes", EpisodeView)
router.register(r"sequences", SequenceView)
router.register(r"shots", ShotView)
router.register(r"steps", StepView)
router.register(r"tasks", TaskView)
router.register(r"usertasks", UserTaskView)
router.register(r"versions", VersionView)
router.register(r"notes", NoteView)
router.register(r"replies", ReplyView)

entity_urls = [
    path("api/v1/entity/", include(router.urls)),
]
