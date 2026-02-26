from django.db import models
from django.utils import timezone


# ---------------------------------------------------------------------------
# Service / Product models
# ---------------------------------------------------------------------------

class ServiceCategory(models.TextChoices):
    FLEET = 'fleet', 'Fleet Insurance'
    AIRCRAFT = 'aircraft', 'Aircraft Insurance'
    YACHT = 'yacht', 'Yacht Insurance'


class Service(models.Model):
    category = models.CharField(max_length=20, choices=ServiceCategory.choices)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    short_description = models.TextField()
    full_description = models.TextField()
    icon = models.CharField(max_length=100, blank=True, help_text='Bootstrap icon class e.g. bi-truck')
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    features = models.JSONField(default=list, help_text='List of feature strings')
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return f'{self.get_category_display()} – {self.title}'


# ---------------------------------------------------------------------------
# Inquiry (public, no auth needed)
# ---------------------------------------------------------------------------

class InquiryStatus(models.TextChoices):
    NEW = 'new', 'New'
    IN_REVIEW = 'in_review', 'In Review'
    QUOTED = 'quoted', 'Quoted'
    CLOSED = 'closed', 'Closed'


class Inquiry(models.Model):
    # Contact info
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    company_name = models.CharField(max_length=200, blank=True)

    # Insurance details
    service_category = models.CharField(max_length=20, choices=ServiceCategory.choices)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')

    # Fleet-specific
    fleet_size = models.PositiveIntegerField(null=True, blank=True)
    vehicle_types = models.CharField(max_length=300, blank=True)

    # Aircraft-specific
    aircraft_type = models.CharField(max_length=200, blank=True)
    aircraft_registration = models.CharField(max_length=50, blank=True)
    flight_hours_per_year = models.PositiveIntegerField(null=True, blank=True)

    # Yacht-specific
    yacht_type = models.CharField(max_length=200, blank=True)
    yacht_length_meters = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    cruising_area = models.CharField(max_length=200, blank=True)

    # General
    coverage_amount = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=InquiryStatus.choices, default=InquiryStatus.NEW)

    # Meta
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Staff notes
    staff_notes = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        'users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_inquiries'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Inquiries'

    def __str__(self):
        return f'Inquiry #{self.pk} – {self.full_name} ({self.service_category})'


# ---------------------------------------------------------------------------
# Contact Message (public, no auth)
# ---------------------------------------------------------------------------

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Contact from {self.full_name} – {self.subject[:50]}'


# ---------------------------------------------------------------------------
# Career / Jobs
# ---------------------------------------------------------------------------

class JobType(models.TextChoices):
    FULL_TIME = 'full_time', 'Full Time'
    PART_TIME = 'part_time', 'Part Time'
    CONTRACT = 'contract', 'Contract'
    INTERNSHIP = 'internship', 'Internship'


class JobPosting(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    location = models.CharField(max_length=150)
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    description = models.TextField()
    responsibilities = models.JSONField(default=list)
    requirements = models.JSONField(default=list)
    nice_to_have = models.JSONField(default=list)
    salary_range = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} – {self.department}'

    @property
    def is_open(self):
        if self.deadline:
            return self.deadline >= timezone.now().date() and self.is_active
        return self.is_active


class JobApplication(models.Model):
    class AppStatus(models.TextChoices):
        RECEIVED = 'received', 'Received'
        REVIEWING = 'reviewing', 'Reviewing'
        INTERVIEW = 'interview', 'Interview'
        OFFERED = 'offered', 'Offered'
        REJECTED = 'rejected', 'Rejected'
        WITHDRAWN = 'withdrawn', 'Withdrawn'

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    cover_letter = models.TextField()
    resume = models.FileField(upload_to='resumes/')
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=AppStatus.choices, default=AppStatus.RECEIVED)
    staff_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.full_name} → {self.job.title}'


# ---------------------------------------------------------------------------
# FAQ
# ---------------------------------------------------------------------------

class FAQCategory(models.TextChoices):
    GENERAL = 'general', 'General'
    FLEET = 'fleet', 'Fleet Insurance'
    AIRCRAFT = 'aircraft', 'Aircraft Insurance'
    YACHT = 'yacht', 'Yacht Insurance'
    CLAIMS = 'claims', 'Claims'
    BILLING = 'billing', 'Billing'


class FAQ(models.Model):
    category = models.CharField(max_length=30, choices=FAQCategory.choices, default=FAQCategory.GENERAL)
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'order', 'question']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return f'[{self.get_category_display()}] {self.question[:80]}'


# ---------------------------------------------------------------------------
# Testimonial
# ---------------------------------------------------------------------------

class Testimonial(models.Model):
    client_name = models.CharField(max_length=200)
    client_title = models.CharField(max_length=200, blank=True)
    company = models.CharField(max_length=200, blank=True)
    service_category = models.CharField(max_length=20, choices=ServiceCategory.choices, blank=True)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    avatar = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return f'{self.client_name} – {self.company}'


# ---------------------------------------------------------------------------
# Team Member
# ---------------------------------------------------------------------------

class TeamMember(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    department = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='team/', null=True, blank=True)
    linkedin_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f'{self.name} – {self.role}'