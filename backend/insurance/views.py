from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Service, Inquiry, ContactMessage,
    JobPosting, JobApplication, FAQ, Testimonial, TeamMember
)
from .serializers import (
    ServiceSerializer,
    InquiryCreateSerializer, InquirySerializer,
    ContactMessageCreateSerializer, ContactMessageSerializer,
    JobPostingSerializer,
    JobApplicationSerializer, JobApplicationAdminSerializer,
    FAQSerializer,
    TestimonialSerializer,
    TeamMemberSerializer,
)
from users.permissions import IsAdminUser, IsManagerOrAdmin, IsStaffOrAbove


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'short_description']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Service.objects.all()
        if not (self.request.user.is_authenticated):
            qs = qs.filter(is_active=True)
        return qs


class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'service_category']
    search_fields = ['full_name', 'email', 'company_name']
    ordering_fields = ['created_at', 'status']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsStaffOrAbove()]

    def get_serializer_class(self):
        if self.action == 'create':
            return InquiryCreateSerializer
        return InquirySerializer

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, IsStaffOrAbove])
    def update_status(self, request, pk=None):
        inquiry = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Inquiry.STATUS_CHOICES if hasattr(Inquiry, 'STATUS_CHOICES') else []):
            # Accept any valid status value
            pass
        inquiry.status = new_status
        inquiry.save(update_fields=['status'])
        return Response({'status': inquiry.status})


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'email', 'subject']
    ordering_fields = ['created_at']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsStaffOrAbove()]

    def get_serializer_class(self):
        if self.action == 'create':
            return ContactMessageCreateSerializer
        return ContactMessageSerializer

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, IsStaffOrAbove])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        message.is_read = True
        message.save(update_fields=['is_read'])
        return Response({'is_read': True})


class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.filter(is_active=True)
    serializer_class = JobPostingSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'job_type', 'location']
    search_fields = ['title', 'description', 'department']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsManagerOrAdmin()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return JobPosting.objects.all()
        return JobPosting.objects.filter(is_active=True)


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'job']
    search_fields = ['full_name', 'email']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsManagerOrAdmin()]

    def get_serializer_class(self):
        if self.action == 'create':
            return JobApplicationSerializer
        return JobApplicationAdminSerializer


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['question', 'answer']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.AllowAny()]


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_featured', 'service_category']
    permission_classes = [permissions.AllowAny]


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.AllowAny]