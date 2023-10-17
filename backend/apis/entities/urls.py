from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AssetView,
    EpisodeView,
    ProjectView,
    SequenceView,
    ShotView,
    StepView,
    TaskView,
    UserTaskView,
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

entity_urls = [
    path("api/v1/entity/", include(router.urls)),
]
