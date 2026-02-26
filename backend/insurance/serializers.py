from rest_framework import serializers
from .models import (
    Service, Inquiry, ContactMessage,
    JobPosting, JobApplication, FAQ, Testimonial, TeamMember
)


class ServiceSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'category', 'category_display', 'title', 'slug',
            'short_description', 'full_description', 'icon', 'image',
            'features', 'is_active', 'order',
        ]


class InquiryCreateSerializer(serializers.ModelSerializer):
    """Used for public inquiry submission – no auth required."""

    class Meta:
        model = Inquiry
        fields = [
            'full_name', 'email', 'phone', 'company_name',
            'service_category', 'service',
            # Fleet
            'fleet_size', 'vehicle_types',
            # Aircraft
            'aircraft_type', 'aircraft_registration', 'flight_hours_per_year',
            # Yacht
            'yacht_type', 'yacht_length_meters', 'cruising_area',
            # General
            'coverage_amount', 'message',
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        ip = None
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')
        validated_data['ip_address'] = ip
        return super().create(validated_data)


class InquirySerializer(serializers.ModelSerializer):
    """Full serializer for staff/admin views."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    service_category_display = serializers.CharField(source='get_service_category_display', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Inquiry
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'ip_address']

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name()
        return None


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Public – no auth required."""

    class Meta:
        model = ContactMessage
        fields = ['full_name', 'email', 'phone', 'subject', 'message']

    def create(self, validated_data):
        request = self.context.get('request')
        ip = None
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')
        validated_data['ip_address'] = ip
        return super().create(validated_data)


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class JobPostingSerializer(serializers.ModelSerializer):
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)
    is_open = serializers.BooleanField(read_only=True)
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'department', 'location', 'job_type', 'job_type_display',
            'description', 'responsibilities', 'requirements', 'nice_to_have',
            'salary_range', 'is_active', 'is_open', 'deadline',
            'created_at', 'application_count',
        ]

    def get_application_count(self, obj):
        # Only expose to staff
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.count()
        return None


class JobApplicationSerializer(serializers.ModelSerializer):
    """Public job application submission."""

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'full_name', 'email', 'phone',
            'cover_letter', 'resume', 'linkedin_url', 'portfolio_url',
        ]

    def validate_resume(self, value):
        max_size = 5 * 1024 * 1024  # 5 MB
        if value.size > max_size:
            raise serializers.ValidationError('Resume file must be under 5 MB.')
        allowed_types = ['application/pdf', 'application/msword',
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('Only PDF and Word documents are accepted.')
        return value


class JobApplicationAdminSerializer(serializers.ModelSerializer):
    """Full details for staff."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = JobApplication
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = FAQ
        fields = ['id', 'category', 'category_display', 'question', 'answer', 'order']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_title', 'company',
            'service_category', 'content', 'rating', 'avatar', 'is_featured',
        ]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'department', 'bio',
            'photo', 'linkedin_url', 'email', 'order',
        ]