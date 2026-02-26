from django.contrib import admin
from .models import (
    Service, Inquiry, ContactMessage,
    JobPosting, JobApplication, FAQ, Testimonial, TeamMember
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_active', 'order']
    list_filter = ['category', 'is_active']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title']


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'service_category', 'status', 'created_at']
    list_filter = ['status', 'service_category']
    search_fields = ['full_name', 'email', 'company_name']
    readonly_fields = ['ip_address', 'created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read']
    search_fields = ['full_name', 'email', 'subject']
    readonly_fields = ['ip_address', 'created_at']


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'job_type', 'location', 'is_active', 'deadline']
    list_filter = ['job_type', 'department', 'is_active']
    search_fields = ['title', 'department']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'job', 'status', 'created_at']
    list_filter = ['status', 'job']
    search_fields = ['full_name', 'email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'company', 'rating', 'is_featured', 'is_active']
    list_filter = ['is_featured', 'is_active', 'service_category']


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'department', 'order', 'is_active']
    list_filter = ['department', 'is_active']