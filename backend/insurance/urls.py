from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ServiceViewSet, InquiryViewSet, ContactMessageViewSet,
    JobPostingViewSet, JobApplicationViewSet,
    FAQViewSet, TestimonialViewSet, TeamMemberViewSet,
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'jobs', JobPostingViewSet, basename='job')
router.register(r'applications', JobApplicationViewSet, basename='application')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'team', TeamMemberViewSet, basename='team')

urlpatterns = [
    path('', include(router.urls)),
]