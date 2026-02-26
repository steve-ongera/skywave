# ✈️ SkyWave Insurance — Full-Stack Platform

> Specialist insurance for commercial fleets, aircraft, and luxury yachts.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication & Role System](#authentication--role-system)
- [Public Pages (No Account Required)](#public-pages)
- [Admin Portal](#admin-portal)
- [Database Models](#database-models)
- [Deployment](#deployment)

---

## Project Overview

SkyWave Insurance is a full-stack web platform for a specialist insurance provider covering:

| Division | Products |
|---|---|
| 🚛 Fleet | Commercial vehicle fleets — vans, HGVs, mixed fleets |
| ✈️ Aircraft | Private jets, turboprops, helicopters, commercial aircraft |
| ⛵ Yacht | Sailing yachts, motor yachts, superyachts |

### Key Design Decisions
- **Public users do NOT need an account** to submit inquiries, contact us, or apply for jobs.
- **Staff/admin login** is role-based and accessed via `/admin/login`.
- Backend is a Django REST Framework API; frontend is a React SPA.

---

## Technology Stack

### Backend
| Technology | Purpose |
|---|---|
| Django 4.2 | Web framework |
| Django REST Framework | API layer |
| djangorestframework-simplejwt | JWT authentication |
| django-cors-headers | CORS handling |
| django-filter | Query filtering |
| drf-spectacular | OpenAPI documentation |
| SQLite (dev) / PostgreSQL (prod) | Database |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tooling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| React Helmet Async | SEO meta tags |
| Bootstrap Icons | Icon library |
| Google Fonts (Cormorant Garamond + DM Sans) | Typography |

---

## Project Structure

```
skywave/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── skywave_project/
│   │   ├── settings.py          # Main Django settings
│   │   └── urls.py              # Root URL configuration
│   ├── users/                   # Custom user app
│   │   ├── models.py            # CustomUser (AbstractBaseUser)
│   │   ├── serializers.py       # User & JWT serializers
│   │   ├── views.py             # UserViewSet + JWT views
│   │   ├── urls.py              # Auth URLs
│   │   ├── permissions.py       # IsAdminUser, IsManagerOrAdmin, IsStaffOrAbove
│   │   └── admin.py
│   └── insurance/               # Main insurance app
│       ├── models.py            # All insurance models
│       ├── serializers.py       # All serializers
│       ├── views.py             # All ViewSets
│       ├── urls.py              # Insurance URLs
│       └── admin.py
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx             # React entry point
        ├── App.jsx              # Router & route definitions
        ├── services/
        │   └── api.js           # Axios instance + all API services
        ├── context/
        │   └── AuthContext.jsx  # Authentication state management
        ├── styles/
        │   └── globals.css      # Design system & global styles
        ├── components/
        │   └── layout/
        │       ├── PublicLayout.jsx
        │       ├── AdminLayout.jsx
        │       ├── Navbar.jsx
        │       └── Footer.jsx
        └── pages/
            ├── HomePage.jsx
            ├── AboutPage.jsx
            ├── ServicesPage.jsx
            ├── ServiceDetailPage.jsx
            ├── ContactPage.jsx
            ├── CareersPage.jsx
            ├── JobDetailPage.jsx    # Includes inline application form
            ├── FAQPage.jsx
            ├── InquiryPage.jsx      # 4-step quote wizard
            └── admin/
                ├── AdminLoginPage.jsx
                ├── AdminDashboard.jsx
                ├── AdminInquiries.jsx
                ├── AdminMessages.jsx
                ├── AdminJobs.jsx
                ├── AdminApplications.jsx
                ├── AdminFAQs.jsx
                ├── AdminStaff.jsx
                └── AdminProfile.jsx
```

---

## Backend Setup

### 1. Create virtual environment

```bash
cd skywave/backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your SECRET_KEY and other values
```

### 4. Run migrations

```bash
python manage.py makemigrations users insurance
python manage.py migrate
```

### 5. Create a superuser (admin)

```bash
python manage.py createsuperuser
# Enter email, first name, last name, password
```

### 6. Load sample data (optional)

```bash
python manage.py shell
>>> from insurance.models import FAQ, Service
>>> Service.objects.create(
...     category='fleet', title='Commercial Fleet Insurance', slug='fleet-insurance',
...     short_description='Comprehensive cover for vehicle fleets of all sizes.',
...     full_description='...', icon='bi-truck', features=['Third party liability', 'Accidental damage', 'Breakdown cover'],
... )
```

### 7. Start the development server

```bash
python manage.py runserver
```

API available at: `http://localhost:8000/api/v1/`
API docs (Swagger): `http://localhost:8000/api/docs/`
Django admin: `http://localhost:8000/admin/`

---

## Frontend Setup

### 1. Install dependencies

```bash
cd skywave/frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env if your backend runs on a different port
```

### 3. Start dev server

```bash
npm run dev
```

Frontend available at: `http://localhost:5173`

### 4. Build for production

```bash
npm run build
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | *(required)* |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Frontend origins | `http://localhost:5173` |
| `DB_NAME` | PostgreSQL DB name | *(SQLite by default)* |
| `DB_USER` | PostgreSQL user | — |
| `DB_PASSWORD` | PostgreSQL password | — |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `EMAIL_HOST` | SMTP server | *(console backend)* |
| `EMAIL_HOST_USER` | SMTP username | — |
| `EMAIL_HOST_PASSWORD` | SMTP password | — |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `/api/v1` |
| `VITE_AUTH_URL` | Backend auth URL | `/api/v1/auth` |

---

## API Reference

### Base URL
```
http://localhost:8000/api/v1/
```

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/login/` | Obtain JWT token pair | No |
| POST | `/auth/token/refresh/` | Refresh access token | No |
| GET | `/auth/users/me/` | Get current user | Yes |
| PATCH | `/auth/users/me/` | Update profile | Yes |
| POST | `/auth/users/change_password/` | Change password | Yes |
| POST | `/auth/users/logout/` | Blacklist refresh token | Yes |
| GET | `/auth/users/` | List staff users | Admin/Manager |
| POST | `/auth/users/` | Create staff user | Admin |

### Public Endpoints (No Authentication)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/services/` | List active insurance services |
| GET | `/services/{slug}/` | Service detail |
| POST | `/inquiries/` | Submit insurance inquiry |
| POST | `/contact/` | Send contact message |
| GET | `/jobs/` | List active job postings |
| GET | `/jobs/{id}/` | Job detail |
| POST | `/applications/` | Submit job application |
| GET | `/faqs/` | List FAQs |
| GET | `/testimonials/` | List testimonials |
| GET | `/team/` | List team members |

### Staff-Only Endpoints
| Method | Endpoint | Description | Min Role |
|---|---|---|---|
| GET | `/inquiries/` | List all inquiries | Staff |
| PATCH | `/inquiries/{id}/` | Update inquiry status | Staff |
| GET | `/contact/` | List all messages | Staff |
| PATCH | `/contact/{id}/mark_read/` | Mark message read | Staff |
| POST/PUT/DELETE | `/jobs/` | Manage job postings | Manager |
| GET/PATCH | `/applications/` | Manage applications | Manager |
| POST/PUT/DELETE | `/faqs/` | Manage FAQs | Admin |
| GET/POST/DELETE | `/auth/users/` | Manage staff | Admin |

### Query Parameters
Most list endpoints support:
- `?search=term` — Full-text search
- `?ordering=field` or `?ordering=-field` — Sorting
- `?page=2` — Pagination (20 per page default)
- Model-specific filters (e.g. `?status=new`, `?category=fleet`)

---

## Authentication & Role System

### JWT Flow
1. POST credentials to `/auth/login/` → receive `access` + `refresh` tokens
2. Include `Authorization: Bearer <access_token>` header on protected requests
3. Access tokens expire after **8 hours**; refresh tokens after **30 days**
4. Use `/auth/token/refresh/` to get a new access token
5. Logout blacklists the refresh token

### Roles
| Role | Permissions |
|---|---|
| `staff` | View inquiries, messages |
| `manager` | Staff + manage jobs, applications |
| `admin` | Full access: manage FAQs, staff, all data |

### Custom User Model
The `CustomUser` model extends `AbstractBaseUser` with:
- Email as `USERNAME_FIELD` (no username)
- `role` field: `staff` / `manager` / `admin`
- `department` and `phone` fields
- Full Django permissions support via `PermissionsMixin`

---

## Public Pages

All public pages are accessible without login:

### `/` — Home Page
- Hero section with animated background
- Statistics bar (years, policies, satisfaction, countries)
- Three service category cards (Fleet / Aircraft / Yacht)
- "Why SkyWave" feature grid (6 differentiators)
- Featured testimonials (loaded from API)
- CTA banner with quote and contact links
- **SEO:** Full Open Graph meta tags, canonical URL

### `/about` — About Page
- Mission statement and company values
- Timeline of 25-year history
- Leadership team grid (from API)
- CTA to quote and careers
- **SEO:** Dedicated meta description, OG tags

### `/services` — Services Page
- Category filter pills (Fleet / Aircraft / Yacht)
- Dynamic service cards from API (icon, features, CTA)
- No-account notice banner
- **SEO:** Product-focused meta tags

### `/services/:slug` — Service Detail Page
- Full description with feature checklist
- Sticky sidebar: quote CTA + contact info
- Breadcrumb back link
- **SEO:** Service-specific title and description

### `/contact` — Contact Page
- Contact form (no account needed): name, email, phone, subject, message
- Contact info cards: phone, email, address, hours
- Emergency claims card
- Success/error feedback
- **SEO:** Location and service keywords

### `/careers` — Careers Page
- Company perks grid (health, learning, remote, package)
- Live job listings from API with department filter
- Deadline and job type badges
- Link to individual job detail
- **SEO:** "careers at SkyWave" targeted keywords

### `/careers/:id` — Job Detail + Application
- Full job description, responsibilities, requirements
- Sticky sidebar with job summary
- Inline application form (no account needed): CV upload (PDF/Word, 5 MB max), cover letter, LinkedIn
- Success state with confirmation message
- **SEO:** Job-specific title and description

### `/faqs` — FAQ Page
- Accordion interface with smooth expand/collapse
- Category sidebar filter (General, Fleet, Aircraft, Yacht, Claims, Billing)
- Real-time search within FAQs
- Link to contact if question not found
- **SEO:** FAQ-rich content for search engines

### `/get-quote` — Quote Inquiry (4-Step Wizard)
- Step 1: Select asset type (Fleet / Aircraft / Yacht)
- Step 2: Contact details
- Step 3: Asset-specific fields (dynamic based on category)
- Step 4: Review and submit
- No login required
- **SEO:** Conversion-focused meta tags

---

## Admin Portal

Accessible at `/admin/login` with staff credentials only.

### Dashboard (`/admin`)
- Welcome greeting with time-of-day
- Stats cards: inquiries, messages, jobs, applications
- Quick action links (role-filtered)
- Current role/department display

### Inquiries (`/admin/inquiries`)
- Filterable list (All / New / In Review / Quoted / Closed)
- Side-panel detail view with all inquiry fields
- Inline status update dropdown
- Color-coded status badges

### Messages (`/admin/messages`)
- Unread/read filter with unread counter
- Blue dot indicator for unread messages
- Auto-mark-as-read on open
- Side panel with Reply by Email link

### Jobs (`/admin/jobs`) — Manager+
- Full CRUD: create, edit, deactivate, delete
- Inline form with all job fields
- Responsibilities/requirements as textarea (one per line)
- Application count display

### Applications (`/admin/applications`) — Manager+
- Full list with status pipeline filter
- Side panel with cover letter, resume download, LinkedIn link
- Inline status updates (Received → Reviewing → Interview → Offered / Rejected)

### FAQs (`/admin/faqs`) — Admin only
- Full CRUD for FAQ items
- Category and active/inactive filter
- Inline create/edit form

### Staff Users (`/admin/staff`) — Admin only
- List all staff with role badges
- Create new staff with role assignment
- Activate/deactivate accounts

### My Profile (`/admin/profile`)
- Edit name, phone, department
- Change password with old password verification

---

## Database Models

### `users.CustomUser`
Fields: `email`, `first_name`, `last_name`, `role` (staff/manager/admin), `department`, `phone`, `avatar`, `is_active`, `is_staff`, `date_joined`

### `insurance.Service`
Fields: `category`, `title`, `slug`, `short_description`, `full_description`, `icon`, `image`, `features` (JSON), `is_active`, `order`

### `insurance.Inquiry`
Fields: Contact info + category-specific fields (fleet_size, aircraft_type, yacht_type, etc.) + `coverage_amount`, `status`, `assigned_to`, `staff_notes`

### `insurance.ContactMessage`
Fields: `full_name`, `email`, `phone`, `subject`, `message`, `is_read`, `ip_address`

### `insurance.JobPosting`
Fields: `title`, `department`, `location`, `job_type`, `description`, `responsibilities` (JSON), `requirements` (JSON), `nice_to_have` (JSON), `salary_range`, `deadline`, `is_active`

### `insurance.JobApplication`
Fields: `job` (FK), `full_name`, `email`, `phone`, `cover_letter`, `resume`, `linkedin_url`, `portfolio_url`, `status`

### `insurance.FAQ`
Fields: `category`, `question`, `answer`, `order`, `is_active`

### `insurance.Testimonial`
Fields: `client_name`, `client_title`, `company`, `service_category`, `content`, `rating`, `avatar`, `is_featured`

### `insurance.TeamMember`
Fields: `name`, `role`, `department`, `bio`, `photo`, `linkedin_url`, `email`, `order`

---

## Deployment

### Backend (Production)

1. Set `DEBUG=False` in `.env`
2. Switch `DATABASES` to PostgreSQL in `settings.py`
3. Configure email SMTP settings
4. Run `python manage.py collectstatic`
5. Use `gunicorn` + `nginx` (or a PaaS like Railway, Render, Heroku)

```bash
pip install gunicorn psycopg2-binary
gunicorn skywave_project.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (Production)

```bash
npm run build
# Serve the dist/ folder from nginx or a CDN (Vercel, Netlify, Cloudflare Pages)
```

### nginx Configuration (example)

```nginx
server {
    listen 80;
    server_name skywave-insurance.com;

    # Frontend SPA
    location / {
        root /var/www/skywave/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Media files
    location /media/ {
        alias /var/www/skywave/media/;
    }
}
```

---

## Design System

The frontend uses a custom CSS design system (`src/styles/globals.css`) with:

- **Fonts:** Cormorant Garamond (headings) + DM Sans (body) via Google Fonts
- **Icons:** Bootstrap Icons 1.11 via CDN
- **Palette:** Navy (`#0a1628`) + Gold (`#c9a84c`) + Sky blue (`#4a8fc1`)
- **Aesthetic:** Luxury maritime / refined corporate
- **Responsive:** Mobile-first, breakpoints at 640px / 768px / 900px / 1024px
- **Animations:** CSS `fadeInUp` with staggered delays, hover transitions

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License — see `LICENSE` for details.

---

*Built with ❤️ by the SkyWave Engineering Team*