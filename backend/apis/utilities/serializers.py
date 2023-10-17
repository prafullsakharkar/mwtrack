from rest_framework.serializers import ModelSerializer

from .models import Status, UtilStep


class StatusSerializer(ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"


class UtilStepSerializer(ModelSerializer):
    class Meta:
        model = UtilStep
        fields = "__all__"
