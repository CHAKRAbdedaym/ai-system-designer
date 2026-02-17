from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import SystemDesignRequestSerializer
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .ai_service import analyze_system_design
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .tasks import analyze_system_design_task
from celery.result import AsyncResult
from .models import SystemAnalysis
from django.contrib.auth.models import User




@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {"message": "User created successfully"},
        status=status.HTTP_201_CREATED
    )


@csrf_exempt
@api_view(['POST'])
def create_request(request):
    serializer = SystemDesignRequestSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "System design request created"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @csrf_exempt
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def analyze_request(request):
#     title = request.data.get("title")
#     description = request.data.get("description")

#     if not title or not description:
#         return Response(
#             {"error": "title and description are required"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     analysis = analyze_system_design(title, description)

#     return Response({
#         "title": title,
#         "analysis": analysis
#     })

@api_view(['GET'])
@permission_classes([IsAuthenticated])

def list_requests(request):
    requests = SystemAnalysis.objects.all()  # fetch all
    serializer = SystemDesignRequestSerializer(requests, many=True)
    return Response(serializer.data)




class AnalyzeView(APIView):
    def post(self, request):
        title = request.data.get("title")
        description = request.data.get("description")

        # Create DB record first
        obj = SystemAnalysis.objects.create(
            user=request.user,
            title=title,
            description=description,
            status="processing"
        )

        # Launch Celery task
        analyze_system_design_task.delay(
            str(obj.task_id),
            title,
            description
        )

        return Response({
            "task_id": str(obj.task_id),
            "status": "processing"
        })


class AnalyzeResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        try:
            obj = SystemAnalysis.objects.get(
                task_id=task_id,
                user=request.user
            )
        except SystemAnalysis.DoesNotExist:
            return Response(
                {"status": "not found"},
                status=404
            )

        return Response({
            "status": obj.status,
            "result": obj.result,
            "created_at": obj.created_at
        })



class MyAnalysesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = SystemAnalysis.objects.filter(
            user=request.user
        ).order_by("-created_at")

        data = [
            {
                "task_id": str(a.task_id),
                "title": a.title,
                "status": a.status,
                "description": a.description,
                "created_at": a.created_at,
            }
            for a in analyses
        ]

        return Response(data)