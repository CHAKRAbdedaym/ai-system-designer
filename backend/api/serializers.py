from rest_framework import serializers
from .models import SystemAnalysis

class SystemDesignRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemAnalysis
        fields = '__all__'
