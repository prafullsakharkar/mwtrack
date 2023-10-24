from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .selectors import validate_ids


def bulk_update(entity, entity_serializer, project, data=None):
    if not isinstance(data, list):
        raise ValidationError(
            "Multiple updates failed for {}, data list not found".format(str(entity))
        )

    ids = validate_ids(data)

    instances = entity.objects.filter(pk__in=ids, project=project)
    serializer = entity_serializer(instances, data=data, partial=True, many=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return serializer.data
