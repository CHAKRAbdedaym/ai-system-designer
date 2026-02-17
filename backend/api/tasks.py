from celery import shared_task
from .models import SystemAnalysis
from .ai_service import analyze_system_design


@shared_task
def analyze_system_design_task(task_id, title, description):
    # Call AI service
    result = analyze_system_design(title, description)

    # Update existing DB object
    obj = SystemAnalysis.objects.get(task_id=task_id)
    obj.result = result
    obj.status = "done"
    obj.save()

    return result
