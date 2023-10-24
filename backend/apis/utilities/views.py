import hashlib

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import FileUpload, Status, UtilStep
from .serializers import (
    FileUpload,
    FileUploadSerializer,
    StatusSerializer,
    UtilStepSerializer,
)


class StatusView(ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = {"id": ["in", "exact"], "name": ["exact"]}


class UtilStepView(ModelViewSet):
    queryset = UtilStep.objects.all()
    serializer_class = UtilStepSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = {"id": ["in", "exact"], "entity": ["exact"]}


class FileUploadView(ModelViewSet):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer

    filter_backends = (DjangoFilterBackend,)
    filterset_fields = {"id": ["in", "exact"], "md5sum": ["exact"]}

    def create(self, request):
        """
        Create uploadfile with the given data
        """
        result = list()
        if request.FILES.getlist("files"):
            files = request.FILES.getlist("files")
            for file in files:
                md5sum = hashlib.md5(file.read()).hexdigest()
                exists = FileUpload.objects.filter(md5sum=md5sum)
                if exists:
                    print(f"This file is already exists : ({file.name})")
                    result.append(self.get_serializer(exists[0]).data)
                    continue

                request_data = {
                    "name": file.name,
                    "type": file.content_type,
                    "url": file,
                    "md5sum": md5sum,
                }
                serializer = self.get_serializer(data=request_data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                result.append(serializer.data)
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            return super().create(request)
