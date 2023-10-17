from apis.entities.models import (
    Asset,
    Episode,
    Project,
    Sequence,
    Shot,
    Step,
    Task,
    UserTask,
)
from django.contrib import admin

admin.site.register(Project)
admin.site.register(Asset)
admin.site.register(Episode)
admin.site.register(Sequence)
admin.site.register(Shot)
admin.site.register(Step)
admin.site.register(Task)
admin.site.register(UserTask)
