from rest_framework.viewsets import ModelViewSet

from .models import Status, UtilStep
from .serializers import StatusSerializer, UtilStepSerializer


class StatusView(ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer


class UtilStepView(ModelViewSet):
    queryset = UtilStep.objects.all()
    serializer_class = UtilStepSerializer
