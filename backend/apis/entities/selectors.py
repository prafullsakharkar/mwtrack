from rest_framework.exceptions import ValidationError
from rest_framework.utils import model_meta


def validate_ids(data, field="uid", unique=True):
    if isinstance(data, list):
        id_list = [str(x[field]) for x in data if field in x]
        if not id_list:
            id_list = [str(x["id"]) for x in data if "id" in x]

        if unique and len(id_list) != len(set(id_list)):
            raise ValidationError("Multiple updates to a single {} found".format(field))

        return id_list

    return [data]


def get_entities(entity, entity_serializer, request, field, field_value):
    fields = list(model_meta.get_field_info(entity).fields)
    filter = {field: field_value}
    for key, value in request.query_params.items():
        if key not in fields:
            continue
        serach_value = value.split(",")
        if len(serach_value) > 1:
            filter[f"{key}__in"] = serach_value
        else:
            filter[key] = value
    entities = entity.objects.filter(**filter)
    serializer = entity_serializer(entities, many=True)
    return serializer.data
