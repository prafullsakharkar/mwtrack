from django.contrib.auth.models import Group, Permission
from rest_framework.viewsets import ModelViewSet

from .models import User
from .serializers import GroupSerializer, UserSerializer


class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupView(ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
