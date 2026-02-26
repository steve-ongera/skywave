"""
management/commands/seed_data.py

Populates the database with realistic sample data for all SkyWave models.

Usage:
    python manage.py seed_data                   # seed everything
    python manage.py seed_data --model users     # seed only users
    python manage.py seed_data --model services  # seed only services
    python manage.py seed_data --model inquiries
    python manage.py seed_data --model contacts
    python manage.py seed_data --model jobs
    python manage.py seed_data --model applications
    python manage.py seed_data --model faqs
    python manage.py seed_data --model testimonials
    python manage.py seed_data --model team
    python manage.py seed_data --flush            # wipe all data first, then seed
    python manage.py seed_data --flush --model users
"""

import random
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from insurance.models import (
    ContactMessage,
    FAQ,
    FAQCategory,
    Inquiry,
    InquiryStatus,
    JobApplication,
    JobPosting,
    JobType,
    Service,
    ServiceCategory,
    TeamMember,
    Testimonial,
)

User = get_user_model()

# ── Colour helpers ───────────────────────────────────────────────────────────

GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"


def ok(msg):   return f"{GREEN}✔  {msg}{RESET}"
def info(msg): return f"{CYAN}→  {msg}{RESET}"
def warn(msg): return f"{YELLOW}⚠  {msg}{RESET}"
def err(msg):  return f"{RED}✘  {msg}{RESET}"


# ═══════════════════════════════════════════════════════════════════════════
# Seed helpers
# ═══════════════════════════════════════════════════════════════════════════

def seed_users(stdout):
    """Create one superadmin + staff + manager accounts."""
    created = 0

    accounts = [
        # (email, first, last, role, dept, is_staff, is_superuser, pw)
        ("admin@skywave.com",      "Alexandra", "Stone",   "admin",   "Executive",       True,  True,  "Admin@12345"),
        ("manager@skywave.com",    "Marcus",    "Flynn",   "manager", "Underwriting",    True,  False, "Manager@12345"),
        ("sarah@skywave.com",      "Sarah",     "Chen",    "staff",   "Fleet Division",  False, False, "Staff@12345"),
        ("james@skywave.com",      "James",     "Okafor",  "staff",   "Aviation",        False, False, "Staff@12345"),
        ("priya@skywave.com",      "Priya",     "Nair",    "staff",   "Marine",          False, False, "Staff@12345"),
        ("tom@skywave.com",        "Thomas",    "Wright",  "manager", "Claims",          True,  False, "Manager@12345"),
        ("lucia@skywave.com",      "Lucia",     "Moreno",  "staff",   "Customer Success",False, False, "Staff@12345"),
    ]

    for email, first, last, role, dept, is_staff, is_superuser, pw in accounts:
        if User.objects.filter(email=email).exists():
            stdout.write(warn(f"User {email} already exists — skipped"))
            continue
        if is_superuser:
            User.objects.create_superuser(
                email=email, password=pw,
                first_name=first, last_name=last,
                role=role, department=dept,
            )
        else:
            u = User(
                email=email, first_name=first, last_name=last,
                role=role, department=dept, is_staff=is_staff,
            )
            u.set_password(pw)
            u.save()
        created += 1
        stdout.write(ok(f"Created user {email} [{role}]"))

    stdout.write(info(f"Users: {created} created\n"))


def seed_services(stdout):
    """Create three flagship services (one per category) with sub-products."""

    services_data = [
        # ── FLEET ──────────────────────────────────────────────────────────
        {
            "category": ServiceCategory.FLEET,
            "title": "Commercial Fleet Insurance",
            "slug": "fleet-insurance",
            "short_description": (
                "One comprehensive policy covering your entire commercial vehicle fleet — "
                "from light vans to heavy goods vehicles — with flexible cover options "
                "and a single renewal date."
            ),
            "full_description": (
                "Managing a commercial fleet means balancing operational efficiency with "
                "ever-present risk. A single incident can ground vehicles, disrupt supply "
                "chains and generate significant liability exposure. Our Commercial Fleet "
                "Insurance policy is engineered to eliminate that uncertainty.\n\n"
                "We cover fleets of 3 vehicles or more, with no upper limit. Every policy "
                "is individually rated — we don't apply blanket premiums. Our fleet "
                "underwriters analyse your vehicle types, driver profiles, operating radius "
                "and claims history to produce a genuinely competitive, accurate premium.\n\n"
                "Key cover includes: third-party liability (unlimited), accidental damage "
                "(agreed value or market value), fire and theft, windscreen and glass, "
                "breakdown and recovery, and hire vehicle during repair. Optional extensions "
                "include goods-in-transit, employer's liability for drivers, and telematics "
                "discount schemes."
            ),
            "icon": "bi-truck",
            "features": [
                "Third-party liability — unlimited indemnity",
                "Accidental damage (agreed or market value)",
                "Fire, theft and attempted theft",
                "Windscreen, glass and sunroof replacement",
                "Breakdown and roadside recovery (24/7)",
                "Replacement hire vehicle during repairs",
                "New vehicle replacement (vehicles under 12 months)",
                "Goods-in-transit cover (optional)",
                "Telematics & fleet camera discount schemes",
                "Single renewal date for the entire fleet",
                "Dedicated fleet account manager",
                "Quarterly fleet safety reporting",
            ],
            "order": 1,
        },
        {
            "category": ServiceCategory.FLEET,
            "title": "Public Sector Fleet Insurance",
            "slug": "public-sector-fleet",
            "short_description": (
                "Specialist fleet cover for local authorities, emergency services, NHS trusts "
                "and other public bodies — with procurement framework compliance built in."
            ),
            "full_description": (
                "Public sector organisations operate under unique governance requirements. "
                "Our public sector fleet product is designed for procurement framework "
                "compliance, provides robust audit trails, and includes cover for specialist "
                "vehicles including refuse collection, road maintenance, and emergency response.\n\n"
                "We understand that public sector claims require handling with transparency "
                "and a clear chain of accountability. Our dedicated public sector claims "
                "team has experience managing FOIA requests, third-party recoveries, and "
                "liaison with police and coroners."
            ),
            "icon": "bi-building-fill-gear",
            "features": [
                "Procurement framework compliant (CCS RM6187)",
                "Specialist and adapted vehicle cover",
                "Emergency response vehicle cover",
                "Blue-light exemption endorsements",
                "FOIA-compatible claims reporting",
                "Public liability extension",
                "Annual fleet health checks",
            ],
            "order": 2,
        },

        # ── AIRCRAFT ───────────────────────────────────────────────────────
        {
            "category": ServiceCategory.AIRCRAFT,
            "title": "Private & Business Aviation Insurance",
            "slug": "aircraft-insurance",
            "short_description": (
                "Comprehensive aviation hull and liability cover for private jets, "
                "turboprops, piston aircraft and helicopters — whether owner-flown "
                "or professionally crewed."
            ),
            "full_description": (
                "Aircraft represent one of the highest-value, highest-complexity assets in "
                "the insurance market. Premiums are set by underwriters who have dedicated "
                "their careers to aviation — not generalists applying actuarial tables.\n\n"
                "Our private aviation policy covers hull all-risks (in-flight and "
                "ground), agreed hull value with no depreciation deductions, passenger "
                "and third-party liability up to $500 million, personal accident for "
                "crew and passengers, and war and allied perils (AVN48B).\n\n"
                "We work with operators across the full spectrum — from a privately-owned "
                "Cessna Citation to a managed fleet of Gulfstream G700s. Charter operations, "
                "fractional ownership, and leaseback arrangements are all accommodated "
                "within a single, clean policy structure."
            ),
            "icon": "bi-airplane",
            "features": [
                "Hull all-risks (in-flight and ground)",
                "Agreed hull value — no depreciation deductions",
                "Passenger liability up to $500 million",
                "Third-party property damage liability",
                "War and allied perils (AVN48B)",
                "Crew personal accident cover",
                "Spares and equipment cover",
                "Loss of licence cover (optional)",
                "Hangar keeper's liability",
                "Worldwide territorial limits",
                "24/7 AOG (Aircraft on Ground) assistance",
                "Charter and leaseback endorsements available",
            ],
            "order": 3,
        },
        {
            "category": ServiceCategory.AIRCRAFT,
            "title": "Commercial Airline Insurance",
            "slug": "commercial-airline-insurance",
            "short_description": (
                "Aviation insurance solutions for regional carriers, charter operators and "
                "ACMI lessors — hull, liability, loss of revenue and grounding cover."
            ),
            "full_description": (
                "Commercial airline operations require insurance structures that match the "
                "complexity of their risk exposure. We work with operators to build layered "
                "programmes — primary hull and liability, excess loss, loss of revenue, "
                "and war cover — drawing on our Lloyd's syndicate capacity and panel of "
                "specialist aviation markets.\n\n"
                "Our commercial airline team has placed insurance for operators running "
                "narrowbody and widebody fleets, ATR and Dash 8 turboprop operations, "
                "and ACMI wet-lease arrangements. We understand AOC requirements, IATA "
                "membership obligations, and lender coinsurance requirements."
            ),
            "icon": "bi-airplane-engines",
            "features": [
                "Hull all-risks — fleet and individual aircraft basis",
                "Passenger and third-party liability",
                "Loss of revenue / grounding cover",
                "ACMI and wet-lease endorsements",
                "Lender loss payee and assignment clauses",
                "War and terrorism cover (AVN52H)",
                "Spare engine and rotable parts cover",
                "Crew and passenger personal accident",
                "Ground support equipment cover",
            ],
            "order": 4,
        },

        # ── YACHT ──────────────────────────────────────────────────────────
        {
            "category": ServiceCategory.YACHT,
            "title": "Yacht & Motor Vessel Insurance",
            "slug": "yacht-insurance",
            "short_description": (
                "All-risks hull and liability insurance for sailing yachts, motor yachts "
                "and RIBs from 8 metres to 30 metres — home port or cruising worldwide."
            ),
            "full_description": (
                "Whether your vessel spends her seasons in the Solent or circumnavigating "
                "the globe, our yacht insurance policy provides the comprehensive protection "
                "she deserves.\n\n"
                "Hull cover is all-risks on an agreed value basis — meaning in the event of "
                "total loss, you receive the full insured value without depreciation argument. "
                "Third-party liability is included as standard up to £5 million, with higher "
                "limits available for offshore racing or commercial use.\n\n"
                "We cover: navigating season and lay-up, racing (including offshore), "
                "charter use (occasional and regular), liveaboard use, and single-handed "
                "passages. Personal effects, crew personal accident, and marina fees "
                "following an insured loss are all included at no extra charge."
            ),
            "icon": "bi-water",
            "features": [
                "All-risks hull cover (agreed value)",
                "Third-party liability up to £5 million",
                "Racing cover including offshore events",
                "Charter use endorsement available",
                "Liveaboard and extended cruising cover",
                "Personal effects and equipment",
                "Crew personal accident",
                "Marina fees following insured loss",
                "Salvage and wreck removal",
                "Pollution liability",
                "Emergency towing and assistance (24/7)",
                "EU, Atlantic and worldwide area options",
            ],
            "order": 5,
        },
        {
            "category": ServiceCategory.YACHT,
            "title": "Superyacht Insurance",
            "slug": "superyacht-insurance",
            "short_description": (
                "Bespoke insurance for superyachts over 24 metres — hull, P&I, loss of "
                "charter income, crew liability and repatriation, worldwide."
            ),
            "full_description": (
                "Superyachts demand a level of insurance sophistication that most markets "
                "cannot deliver. SkyWave has placed superyacht cover since 2003 and has "
                "become a recognised name in the superyacht owners' community.\n\n"
                "Every superyacht policy is individually underwritten. We visit vessels "
                "during refit where appropriate, commission independent valuations, and "
                "work closely with flag state administrators and classification societies.\n\n"
                "Our superyacht product covers: all-risks hull on a new-for-old or agreed "
                "value basis, P&I (third-party liability, pollution, passenger and crew "
                "injury), loss of charter hire, crew personal accident and repatriation, "
                "cyber risk, and war and terrorism worldwide."
            ),
            "icon": "bi-tsunami",
            "features": [
                "All-risks hull (new-for-old or agreed value)",
                "P&I including crew and passenger liability",
                "Loss of charter hire income",
                "Cyber risk cover",
                "War and terrorism (worldwide)",
                "Crew personal accident and repatriation",
                "Environmental / pollution liability",
                "Tender, toys and water sports equipment",
                "On-site survey and valuation service",
                "Flag state and class society liaison",
                "24/7 emergency response worldwide",
            ],
            "order": 6,
        },
    ]

    created = 0
    for data in services_data:
        slug = data["slug"]
        if Service.objects.filter(slug=slug).exists():
            stdout.write(warn(f"Service '{slug}' already exists — skipped"))
            continue
        Service.objects.create(**data)
        created += 1
        stdout.write(ok(f"Created service: {data['title']}"))

    stdout.write(info(f"Services: {created} created\n"))


def seed_inquiries(stdout):
    """Create realistic inquiries across all three categories."""

    fleet_service   = Service.objects.filter(slug="fleet-insurance").first()
    aircraft_service = Service.objects.filter(slug="aircraft-insurance").first()
    yacht_service   = Service.objects.filter(slug="yacht-insurance").first()

    inquiries_data = [
        # ── FLEET
        {
            "full_name": "David Harrington",
            "email": "d.harrington@harringtonlogistics.co.uk",
            "phone": "+44 7911 123456",
            "company_name": "Harrington Logistics Ltd",
            "service_category": ServiceCategory.FLEET,
            "service": fleet_service,
            "fleet_size": 47,
            "vehicle_types": "18 HGV curtainsiders, 22 transit vans, 7 refrigerated units",
            "coverage_amount": 2400000,
            "message": "Our current insurer has increased our renewal premium by 28% with no claims in 3 years. Looking for a competitive alternative with similar or better cover.",
            "status": InquiryStatus.IN_REVIEW,
        },
        {
            "full_name": "Amara Diallo",
            "email": "amara.diallo@greenroutes.com",
            "phone": "+1 415 555 0192",
            "company_name": "Green Routes Distribution",
            "service_category": ServiceCategory.FLEET,
            "service": fleet_service,
            "fleet_size": 12,
            "vehicle_types": "Electric vans (Maxus eDeliver 9), 2 hybrid SUVs",
            "coverage_amount": 480000,
            "message": "We operate a fully electric last-mile delivery fleet in San Francisco. Need cover that understands EV-specific risks, including high-voltage battery damage.",
            "status": InquiryStatus.NEW,
        },
        {
            "full_name": "Brendan O'Sullivan",
            "email": "brendan@osullivanplant.ie",
            "phone": "+353 87 654 3210",
            "company_name": "O'Sullivan Plant Hire",
            "service_category": ServiceCategory.FLEET,
            "fleet_size": 8,
            "vehicle_types": "3 flatbed trucks, 2 low loaders, 3 equipment transporters",
            "coverage_amount": 950000,
            "message": "Interested in fleet cover with goods in transit. Vehicles operate across Ireland and occasionally into the UK.",
            "status": InquiryStatus.QUOTED,
        },
        {
            "full_name": "Fatima Al-Rashidi",
            "email": "f.alrashidi@citymedical.ae",
            "company_name": "City Medical Transport",
            "service_category": ServiceCategory.FLEET,
            "fleet_size": 31,
            "vehicle_types": "Medical transport vans, 4 wheelchair-accessible vehicles, 2 ambulances",
            "coverage_amount": 1800000,
            "message": "Non-emergency patient transport operator. Need liability up to £10m and cover for medical equipment carried in vehicles.",
            "status": InquiryStatus.NEW,
        },

        # ── AIRCRAFT
        {
            "full_name": "Christopher Ashworth",
            "email": "cashworth@ashworthcapital.com",
            "phone": "+1 212 555 0171",
            "company_name": "Ashworth Capital Partners",
            "service_category": ServiceCategory.AIRCRAFT,
            "service": aircraft_service,
            "aircraft_type": "Gulfstream G550",
            "aircraft_registration": "N881CA",
            "flight_hours_per_year": 320,
            "coverage_amount": 38000000,
            "message": "Owner-operated with a professional crew of 2. Based at Teterboro. Looking to switch from current insurer — unhappy with claims handling speed on last incident.",
            "status": InquiryStatus.IN_REVIEW,
        },
        {
            "full_name": "Hélène Beaumont",
            "email": "helene@beaumont-aviation.fr",
            "phone": "+33 6 12 34 56 78",
            "company_name": "Beaumont Aviation SARL",
            "service_category": ServiceCategory.AIRCRAFT,
            "service": aircraft_service,
            "aircraft_type": "Pilatus PC-12 NGX",
            "aircraft_registration": "F-HBMX",
            "flight_hours_per_year": 210,
            "coverage_amount": 4200000,
            "message": "Single-pilot IFR operations, primarily France and Western Europe. SERA-compliant. Need liability minimum €3m per seat.",
            "status": InquiryStatus.NEW,
        },
        {
            "full_name": "Raj Malhotra",
            "email": "raj.malhotra@indusair.in",
            "phone": "+91 98200 12345",
            "company_name": "Indus Air Charter",
            "service_category": ServiceCategory.AIRCRAFT,
            "aircraft_type": "Beechcraft King Air 350",
            "aircraft_registration": "VT-RMC",
            "flight_hours_per_year": 580,
            "coverage_amount": 3500000,
            "message": "Charter operator based in Mumbai. 3 aircraft, 2 pilots per aircraft. DGCA AOC holder. Need hull and liability with passenger cover to IATA minimums.",
            "status": InquiryStatus.QUOTED,
        },

        # ── YACHT
        {
            "full_name": "Nicolas Ferreira",
            "email": "n.ferreira@ferreiragroup.pt",
            "phone": "+351 91 234 5678",
            "company_name": "",
            "service_category": ServiceCategory.YACHT,
            "service": yacht_service,
            "yacht_type": "Jeanneau Sun Odyssey 490 (sailing)",
            "yacht_length_meters": 14.9,
            "cruising_area": "Mediterranean, Atlantic coast of Portugal and Spain",
            "coverage_amount": 220000,
            "message": "Occasional offshore passages, normally family sailing. Want cover that includes racing in local regattas. Looking for agreed value policy.",
            "status": InquiryStatus.NEW,
        },
        {
            "full_name": "Diana Watts",
            "email": "diana.watts@wattsholdings.com",
            "phone": "+44 7700 900123",
            "company_name": "Watts Holdings",
            "service_category": ServiceCategory.YACHT,
            "service": yacht_service,
            "yacht_type": "Sunseeker Predator 60 (motor yacht)",
            "yacht_length_meters": 18.3,
            "cruising_area": "UK, French Riviera, Adriatic",
            "coverage_amount": 1750000,
            "message": "Planning an extended Mediterranean season this year, departing from Lymington. Permanent professional skipper on board. Need worldwide coverage option for 2026.",
            "status": InquiryStatus.IN_REVIEW,
        },
        {
            "full_name": "Lars Eriksson",
            "email": "lars@erikssonmarine.se",
            "phone": "+46 70 123 45 67",
            "service_category": ServiceCategory.YACHT,
            "yacht_type": "Baltic 67 (performance sailing yacht)",
            "yacht_length_meters": 20.4,
            "cruising_area": "Baltic Sea, North Sea, offshore racing including Fastnet",
            "coverage_amount": 850000,
            "message": "Racing and offshore passages. Last insurer excluded the Fastnet course — this is non-negotiable for us.",
            "status": InquiryStatus.CLOSED,
        },
    ]

    created = 0
    for data in inquiries_data:
        inq, new = Inquiry.objects.get_or_create(email=data["email"], defaults=data)
        if new:
            created += 1
            stdout.write(ok(f"Created inquiry: {data['full_name']} [{data['service_category']}]"))
        else:
            stdout.write(warn(f"Inquiry for {data['email']} already exists — skipped"))

    stdout.write(info(f"Inquiries: {created} created\n"))


def seed_contacts(stdout):
    """Create contact messages."""

    messages_data = [
        {
            "full_name": "Emily Turner",
            "email": "emily.turner@turnerfreight.com",
            "phone": "+44 7912 345678",
            "subject": "Fleet renewal query — timing",
            "message": "Hi, our fleet policy renews in 6 weeks. Is that enough time to go through your quotation process? We have 23 mixed vehicles.",
            "is_read": True,
        },
        {
            "full_name": "Kwame Asante",
            "email": "kwame@asantelogistics.gh",
            "subject": "Coverage for vehicles operating in West Africa",
            "message": "We operate a fleet across Ghana and Côte d'Ivoire. Do you have capacity to insure vehicles operating in West African markets? What documentation would you need?",
            "is_read": False,
        },
        {
            "full_name": "Isabella Conti",
            "email": "i.conti@contiaviation.it",
            "phone": "+39 02 1234 5678",
            "subject": "Hull insurance — Agusta AW139 helicopter",
            "message": "We are looking for hull and liability cover for a single AW139 helicopter used for VIP transfers in Northern Italy. Current cover expires end of month. Please advise on process.",
            "is_read": False,
        },
        {
            "full_name": "Robert Mackenzie",
            "email": "rob@mckholdingsltd.co.uk",
            "subject": "Superyacht insurance — 42m Feadship",
            "message": "I represent the owner of a 42m Feadship motor yacht, currently laid up in Palma de Mallorca. We are looking for a market review ahead of the summer season. Would appreciate a call with one of your marine specialists.",
            "is_read": True,
        },
        {
            "full_name": "Yuki Tanaka",
            "email": "y.tanaka@tanakaflyingclub.jp",
            "subject": "Group aircraft insurance for flying club",
            "message": "Our flying club has 6 aircraft (4 Cessna 172s and 2 Piper Archers) based at a regional airfield in Japan. Can you provide a group policy or do you require individual policies?",
            "is_read": False,
        },
        {
            "full_name": "Sandra Pellegrini",
            "email": "s.pellegrini@gmail.com",
            "subject": "General enquiry — what does yacht insurance cover?",
            "message": "I'm a first-time boat owner looking at a 10m sloop. I have no idea what yacht insurance is supposed to cover. Could someone explain the basics and give me an idea of cost?",
            "is_read": True,
        },
        {
            "full_name": "Ahmed Khalid",
            "email": "ahmed.khalid@gulftransport.ae",
            "phone": "+971 50 123 4567",
            "subject": "Fleet insurance — UAE registered vehicles",
            "message": "We operate 85 vehicles in the UAE (Dubai and Abu Dhabi) including trucks, pickups and staff buses. Can you provide fleet cover for UAE-registered vehicles? We need third party and comprehensive cover.",
            "is_read": False,
        },
    ]

    created = 0
    for data in messages_data:
        msg, new = ContactMessage.objects.get_or_create(email=data["email"], subject=data["subject"], defaults=data)
        if new:
            created += 1
            stdout.write(ok(f"Created contact: {data['full_name']} — '{data['subject'][:50]}'"))
        else:
            stdout.write(warn(f"Contact message from {data['email']} already exists — skipped"))

    stdout.write(info(f"Contact messages: {created} created\n"))


def seed_jobs(stdout):
    """Create realistic job postings."""

    jobs_data = [
        {
            "title": "Senior Marine Underwriter",
            "department": "Marine Division",
            "location": "London (Hybrid — 3 days in office)",
            "job_type": JobType.FULL_TIME,
            "description": (
                "We are looking for an experienced marine underwriter to join our growing "
                "yacht and superyacht division. You will manage a portfolio of high-net-worth "
                "marine risks, develop broker relationships, and contribute to product "
                "development for our international marine book."
            ),
            "responsibilities": [
                "Underwrite and price new and renewal yacht and superyacht risks up to £5m hull value",
                "Develop and maintain broker relationships in the London and continental European market",
                "Conduct vessel surveys and attend boat shows to generate new business",
                "Prepare and present risk reports to the Head of Marine Underwriting",
                "Mentor junior underwriters within the marine team",
                "Contribute to product updates and coverage wording reviews",
                "Manage bordereau submissions and co-insurance arrangements",
            ],
            "requirements": [
                "Minimum 5 years' marine underwriting experience, ideally in yachts or small craft",
                "ACII qualified or working towards qualification",
                "Strong understanding of Institute Yacht Clauses and IYRS wordings",
                "Proven track record managing a profitable portfolio",
                "Excellent written and verbal communication skills",
                "Proficiency in underwriting systems (Sequel, Whitespace or equivalent)",
            ],
            "nice_to_have": [
                "Experience in superyacht or high-value marine risks",
                "Additional European language (French, Italian or Spanish)",
                "RYA offshore sailing qualification",
                "Lloyd's market experience",
            ],
            "salary_range": "£65,000 – £90,000 + bonus + benefits",
            "is_active": True,
            "deadline": date.today() + timedelta(days=45),
        },
        {
            "title": "Aviation Claims Handler",
            "department": "Claims",
            "location": "San Francisco, CA (Hybrid)",
            "job_type": JobType.FULL_TIME,
            "description": (
                "Join our specialist aviation claims team to manage first and third-party "
                "aviation claims from first notification through to settlement. This is a "
                "high-impact role requiring both technical expertise and exceptional client "
                "communication skills."
            ),
            "responsibilities": [
                "Handle a portfolio of private aviation and business jet hull and liability claims",
                "Appoint and manage loss adjusters, salvage contractors and legal counsel",
                "Investigate coverage, establish reserves and report to underwriters",
                "Liaise with CAA/FAA, AAIB/NTSB and other regulatory bodies where required",
                "Negotiate settlements with claimants and third-party representatives",
                "Maintain accurate claims records and produce management information reports",
                "Attend on-site where required including accident sites",
            ],
            "requirements": [
                "Minimum 3 years in aviation claims handling",
                "Knowledge of aviation insurance clauses (AVN48B, AVN52H, AVS103)",
                "Experience managing hull damage and liability claims",
                "Ability to work to tight deadlines and manage multiple claims simultaneously",
                "Strong numeracy and analytical skills",
                "ACII or CIP qualification (or equivalent)",
            ],
            "nice_to_have": [
                "Private pilot licence (PPL) or aviation technical background",
                "Experience with US domestic aviation claims",
                "Spanish or Portuguese language skills",
            ],
            "salary_range": "$75,000 – $100,000 + performance bonus",
            "is_active": True,
            "deadline": date.today() + timedelta(days=30),
        },
        {
            "title": "Fleet Account Manager",
            "department": "Fleet Division",
            "location": "Manchester, UK (Field-based with office days)",
            "job_type": JobType.FULL_TIME,
            "description": (
                "An exciting opportunity to manage and grow a portfolio of commercial fleet "
                "insurance accounts across the North of England. You will be the primary "
                "point of contact for brokers and fleet operators, delivering exceptional "
                "service and identifying cross-sell opportunities."
            ),
            "responsibilities": [
                "Manage a portfolio of 80-120 commercial fleet accounts",
                "Conduct annual fleet reviews and renewal negotiations",
                "Visit brokers and fleet operators quarterly to maintain relationships",
                "Identify upselling and cross-selling opportunities within the portfolio",
                "Work with underwriters to tailor cover for unusual or complex fleets",
                "Produce monthly portfolio performance reports",
                "Attend fleet industry events and exhibitions",
            ],
            "requirements": [
                "3+ years in commercial motor or fleet insurance (broker or insurer side)",
                "Strong commercial awareness and negotiation skills",
                "Full UK driving licence",
                "Cert CII minimum qualification",
                "Excellent client-facing communication and presentation skills",
                "Proficiency in CRM and policy management systems",
            ],
            "nice_to_have": [
                "Experience with telematics and fleet risk management",
                "Knowledge of HGV and specialist vehicle markets",
                "Diploma CII or working towards",
            ],
            "salary_range": "£42,000 – £58,000 + car allowance + commission",
            "is_active": True,
            "deadline": date.today() + timedelta(days=21),
        },
        {
            "title": "Data Analyst — Insurance Operations",
            "department": "Operations",
            "location": "Remote (Europe time zone)",
            "job_type": JobType.FULL_TIME,
            "description": (
                "We are building out our data capability and need a skilled analyst to help "
                "us make better use of our policy, claims and broker data. You will work "
                "closely with underwriting and claims teams to produce actionable insights "
                "that drive pricing accuracy and operational efficiency."
            ),
            "responsibilities": [
                "Build and maintain dashboards tracking portfolio performance, claims frequency and severity",
                "Analyse underwriting data to identify profitable and unprofitable risk segments",
                "Produce monthly board reports and ad-hoc analysis for senior leadership",
                "Work with IT to improve data quality and integration between systems",
                "Support actuarial team with data extraction and transformation",
                "Develop pricing models for new products and geographies",
            ],
            "requirements": [
                "3+ years in a data analyst role, ideally in financial services or insurance",
                "Proficiency in Python or R for data analysis",
                "Strong SQL skills (PostgreSQL or similar)",
                "Experience with BI tools (Power BI, Tableau or similar)",
                "Ability to communicate complex data findings to non-technical stakeholders",
                "Degree in Mathematics, Statistics, Computer Science or related field",
            ],
            "nice_to_have": [
                "Experience with insurance-specific data (earned premium, IBNR, loss ratios)",
                "Familiarity with dbt or similar data transformation tools",
                "Knowledge of Lloyd's reporting requirements",
            ],
            "salary_range": "£48,000 – £65,000",
            "is_active": True,
            "deadline": date.today() + timedelta(days=60),
        },
        {
            "title": "Marketing Executive",
            "department": "Marketing",
            "location": "London (Hybrid)",
            "job_type": JobType.FULL_TIME,
            "description": (
                "We are looking for a creative, commercially-minded marketing executive to "
                "help grow the SkyWave brand. You will manage our digital presence, create "
                "compelling content, and run targeted campaigns to generate high-quality leads "
                "in our three specialist markets."
            ),
            "responsibilities": [
                "Manage and optimise the SkyWave website (SEO, UX, conversion rate)",
                "Create content for the blog, social media, and industry publications",
                "Run and optimise paid digital campaigns (Google Ads, LinkedIn)",
                "Produce and distribute the quarterly client newsletter",
                "Manage presence at trade shows and industry events",
                "Coordinate with underwriting teams to create product-specific collateral",
                "Track and report on marketing KPIs monthly",
            ],
            "requirements": [
                "2+ years in a B2B marketing role",
                "Strong copywriting skills — able to produce clear, engaging copy for technical audiences",
                "Experience managing website content (WordPress or similar CMS)",
                "Proficiency with Google Analytics, Google Ads and LinkedIn Campaign Manager",
                "Organised and able to manage multiple campaigns simultaneously",
            ],
            "nice_to_have": [
                "Experience marketing financial services or insurance products",
                "Photography or video editing skills",
                "Knowledge of the marine, aviation or fleet sectors",
            ],
            "salary_range": "£32,000 – £42,000 + discretionary bonus",
            "is_active": True,
            "deadline": date.today() + timedelta(days=35),
        },
        {
            "title": "Graduate Underwriting Trainee",
            "department": "Underwriting",
            "location": "London",
            "job_type": JobType.FULL_TIME,
            "description": (
                "A structured two-year graduate programme rotating through our Fleet, "
                "Aviation and Marine underwriting divisions. You will learn the craft of "
                "specialist insurance underwriting from experienced practitioners, with "
                "full study support for CII qualifications."
            ),
            "responsibilities": [
                "Rotate through Fleet, Aviation and Marine divisions over 24 months",
                "Assist senior underwriters with risk assessment and pricing",
                "Prepare risk presentations and renewal reports",
                "Manage a small book of straightforward renewals under supervision",
                "Attend client visits and broker meetings with senior colleagues",
                "Complete CII Certificate and Diploma with company study support",
            ],
            "requirements": [
                "2:1 degree or above in any discipline",
                "Strong analytical and numerical skills",
                "Excellent written and verbal communication",
                "Genuine interest in insurance, risk and financial services",
                "Ability to manage competing priorities and work to deadlines",
            ],
            "nice_to_have": [
                "Experience in marine, aviation or logistics industry (work experience or internship)",
                "A-level Mathematics or equivalent",
                "Interest in sailing, aviation or motorsport",
            ],
            "salary_range": "£28,000 – £34,000 + study support + bonus",
            "is_active": True,
            "deadline": date.today() + timedelta(days=90),
        },
        {
            "title": "IT Infrastructure Engineer",
            "department": "Technology",
            "location": "Remote (UK or EU)",
            "job_type": JobType.FULL_TIME,
            "description": (
                "We are modernising our technology infrastructure and need a capable "
                "infrastructure engineer to help us move workloads to cloud, improve "
                "reliability and security, and support our growing remote workforce."
            ),
            "responsibilities": [
                "Manage and improve AWS cloud infrastructure (EC2, RDS, S3, CloudFront)",
                "Maintain CI/CD pipelines for backend and frontend deployments",
                "Implement security best practices and compliance controls (ISO 27001)",
                "Monitor system performance and respond to incidents",
                "Manage endpoint security and MDM for remote workforce",
                "Support office network and VPN infrastructure",
                "Produce technical documentation and runbooks",
            ],
            "requirements": [
                "3+ years in an infrastructure or DevOps role",
                "Strong AWS experience (EC2, RDS, S3, IAM, VPC)",
                "Proficiency with Linux server administration",
                "Experience with Docker and container orchestration",
                "Familiarity with Terraform or similar IaC tools",
                "Understanding of network security and firewalling",
            ],
            "nice_to_have": [
                "AWS Solutions Architect certification",
                "Experience in a regulated industry (FCA, Lloyd's)",
                "Kubernetes experience",
                "PostgreSQL database administration",
            ],
            "salary_range": "£55,000 – £75,000",
            "is_active": False,  # Filled — inactive
            "deadline": date.today() - timedelta(days=10),
        },
    ]

    created = 0
    for data in jobs_data:
        job, new = JobPosting.objects.get_or_create(title=data["title"], department=data["department"], defaults=data)
        if new:
            created += 1
            stdout.write(ok(f"Created job: {data['title']} [{data['department']}]"))
        else:
            stdout.write(warn(f"Job '{data['title']}' already exists — skipped"))

    stdout.write(info(f"Jobs: {created} created\n"))


def seed_applications(stdout):
    """Create sample job applications."""

    jobs = {j.title: j for j in JobPosting.objects.all()}
    if not jobs:
        stdout.write(warn("No jobs found — run seed_jobs first\n"))
        return

    target_job = jobs.get("Senior Marine Underwriter") or list(jobs.values())[0]

    apps_data = [
        {
            "job": target_job,
            "full_name": "Charlotte Davies",
            "email": "charlotte.davies@marinebroker.co.uk",
            "phone": "+44 7812 345678",
            "cover_letter": (
                "I am writing to apply for the Senior Marine Underwriter position at SkyWave. "
                "I have six years of marine underwriting experience at Brit Insurance, "
                "where I managed a portfolio of 120 yacht and small craft accounts with a "
                "combined premium income of £2.1m. I hold the ACII qualification and have "
                "recently completed the Lloyd's Market Association's Advanced Marine Course.\n\n"
                "I am particularly drawn to SkyWave's reputation for genuine specialist "
                "expertise and the opportunity to work on superyacht risks, which has been "
                "a career ambition. I am an active sailor (RYA Yachtmaster Offshore) which "
                "I believe adds real value to my risk assessments."
            ),
            "linkedin_url": "https://linkedin.com/in/charlotte-davies-acii",
            "status": "reviewing",
        },
        {
            "job": target_job,
            "full_name": "Matteo Russo",
            "email": "matteo.russo@unipol.it",
            "phone": "+39 333 456 7890",
            "cover_letter": (
                "Having spent four years as a marine underwriter at UnipolSai in Milan, "
                "specialising in yacht and small craft risks for the Italian and Mediterranean "
                "market, I am eager to bring my expertise to SkyWave.\n\n"
                "My portfolio includes a broad range of sailing and motor yachts from 8m to "
                "32m LOA. I am fluent in Italian, French and English, which I believe would "
                "be a significant asset in your continental European market development.\n\n"
                "I hold the CIP qualification and am currently completing my ACII studies."
            ),
            "linkedin_url": "https://linkedin.com/in/matteo-russo-marine",
            "status": "received",
        },
    ]

    # Add applications for other jobs too
    avail_jobs = list(jobs.values())
    extra_apps = [
        {
            "job": avail_jobs[min(1, len(avail_jobs)-1)],
            "full_name": "Samantha Osei",
            "email": "s.osei@aviationclaims.co.uk",
            "phone": "+44 7912 999001",
            "cover_letter": "Three years handling aviation claims at AXA XL. Strong knowledge of AVN clauses and regulatory liaison experience with the UK CAA.",
            "status": "interview",
        },
        {
            "job": avail_jobs[min(2, len(avail_jobs)-1)],
            "full_name": "George Flemming",
            "email": "george.flemming@fleetbroker.com",
            "phone": "+44 7723 456789",
            "cover_letter": "Seven years in commercial fleet insurance on the broker side. Strong relationships with Northern England operators and logistics companies.",
            "status": "received",
        },
        {
            "job": avail_jobs[min(5, len(avail_jobs)-1)],
            "full_name": "Aisha Kamara",
            "email": "aisha.kamara@lse.ac.uk",
            "phone": "+44 7400 112233",
            "cover_letter": "Recently completed MSci Mathematics at LSE (First Class). Keen to start my career in specialist insurance underwriting. Sailed competitively for six years.",
            "status": "received",
        },
    ]

    created = 0
    for data in apps_data + extra_apps:
        if JobApplication.objects.filter(email=data["email"], job=data["job"]).exists():
            stdout.write(warn(f"Application from {data['email']} already exists — skipped"))
            continue
        # resume field is required — use a dummy path
        app = JobApplication(**data)
        app.resume = "resumes/sample_cv_placeholder.pdf"
        app.save()
        created += 1
        stdout.write(ok(f"Created application: {data['full_name']} → {data['job'].title}"))

    stdout.write(info(f"Applications: {created} created\n"))


def seed_faqs(stdout):
    """Create comprehensive FAQs across all categories."""

    faqs_data = [
        # ── GENERAL
        (FAQCategory.GENERAL, "How do I get a quote?",
         "You can submit an inquiry directly on our website — no account is required. Simply click 'Get a Quote', select your asset type, fill in the details, and one of our specialists will respond within one business day with a personalised quotation.", 1),
        (FAQCategory.GENERAL, "Do I need to create an account to get insurance?",
         "No. Public users can submit inquiries, send contact messages, and apply for jobs without creating an account. SkyWave accounts are only used by our internal staff and admin team.", 2),
        (FAQCategory.GENERAL, "Which countries do you cover?",
         "SkyWave has underwriting capacity in over 120 countries. Our fleet policies can be extended to cover vehicles operating internationally. Aircraft policies typically include worldwide cover as standard. Marine policies offer area options including home waters, European waters, Atlantic, and worldwide.", 3),
        (FAQCategory.GENERAL, "How quickly can cover be arranged?",
         "For standard risks we can typically provide a quotation within 24 hours and bind cover the same day once terms are agreed. Complex or high-value risks may require additional underwriting information, survey or co-insurance arrangements, which can take 3–5 business days.", 4),
        (FAQCategory.GENERAL, "Is SkyWave regulated?",
         "Yes. SkyWave Insurance is authorised and regulated by the Financial Conduct Authority (FCA). Our Lloyd's Syndicate operates under Lloyd's of London regulations. We are a member of the British Insurance Brokers' Association (BIBA).", 5),

        # ── FLEET
        (FAQCategory.FLEET, "What is the minimum fleet size you insure?",
         "We insure fleets from 3 vehicles upwards. Smaller fleets may also be considered on a case-by-case basis, particularly where there is a specific risk characteristic (e.g. specialist or high-value vehicles).", 1),
        (FAQCategory.FLEET, "Can you insure a fleet that includes electric vehicles (EVs)?",
         "Yes. We have specific underwriting expertise in electric and hybrid fleets. Our EV cover includes high-voltage battery damage, charging equipment liability, and infrastructure damage — risks that standard policies often exclude or limit.", 2),
        (FAQCategory.FLEET, "Do you offer telematics or 'black box' discounts?",
         "Yes. We have partnerships with leading telematics providers and can offer meaningful premium discounts for fleets that adopt driver behaviour monitoring. Discounts typically range from 5–15% depending on fleet size and data quality.", 3),
        (FAQCategory.FLEET, "What happens if I add or remove vehicles from the fleet?",
         "Vehicles can be added to or removed from your policy at any time. For additions, temporary cover is usually available immediately from the day of notification. Premium adjustments are made at the next renewal unless the fleet changes significantly during the year.", 4),
        (FAQCategory.FLEET, "Does fleet cover include goods in transit?",
         "Goods in transit (GIT) is available as an optional extension. You can choose the coverage amount, excess level and territorial limits. GIT for hazardous materials or high-value goods may require additional underwriting information.", 5),
        (FAQCategory.FLEET, "Can you insure vehicles operating in multiple countries?",
         "Yes. We can provide EU-wide territorial limits as standard, and worldwide cover on request. For fleets operating in specific regions (e.g. Middle East, West Africa) we can arrange local co-insurance arrangements where required by law.", 6),

        # ── AIRCRAFT
        (FAQCategory.AIRCRAFT, "What types of aircraft do you insure?",
         "We insure a broad range of aircraft including piston singles and twins, turboprop aircraft, business jets (light, mid and large cabin), helicopters (piston and turbine), and commercial airline aircraft (narrowbody and widebody). We do not currently insure ultralights, microlights or drones.", 1),
        (FAQCategory.AIRCRAFT, "What is 'agreed value' cover and why does it matter?",
         "Agreed value means the insured hull value is agreed at inception and paid in full in the event of a total loss — with no depreciation deductions. This contrasts with 'market value' policies, which pay only the market value at the time of loss. We recommend agreed value for all aircraft over three years old.", 2),
        (FAQCategory.AIRCRAFT, "Does my aircraft policy cover war and terrorism risks?",
         "Yes. Our standard aviation policies include war and allied perils under AVN48B wording, which covers war, terrorism, confiscation, and similar perils. This can be written on a worldwide or restricted territory basis. We can also provide separate war cover under AVN52H for higher-value aircraft.", 3),
        (FAQCategory.AIRCRAFT, "I fly owner-pilot — do I still need a separate crew personal accident policy?",
         "Crew personal accident cover for the pilot is included within our standard aviation liability section. If you require enhanced cover (e.g. higher benefit levels, income replacement, or cover for passengers), we can add a dedicated personal accident extension.", 4),
        (FAQCategory.AIRCRAFT, "Can you insure charter operations or aircraft on leaseback?",
         "Yes. Both charter operations (AOC holders and private) and aircraft on leaseback arrangements can be accommodated within our standard policy structure with appropriate endorsements. Please provide details of the charter/leaseback arrangement when submitting your inquiry.", 5),

        # ── YACHT
        (FAQCategory.YACHT, "What does 'all-risks' yacht cover mean?",
         "An all-risks policy covers any physical loss or damage to the vessel unless specifically excluded. This is broader than 'named perils' cover, which only pays for the specific causes of loss listed in the policy. Our yacht policies are all-risks as standard.", 1),
        (FAQCategory.YACHT, "Is third-party liability included in my yacht policy?",
         "Yes. Third-party liability (covering damage to other vessels, property or injury to third parties) is included as standard in all our yacht policies. Standard limits are £/€/$3 million, with higher limits available on request — particularly recommended for offshore racing.", 2),
        (FAQCategory.YACHT, "Does my policy cover racing?",
         "Inshore and coastal racing cover is included as standard. Offshore racing (Fastnet, ARC, Rolex Sydney Hobart etc.) is available as an optional extension — this should be requested before the event. Racing exclusions apply to professional racing campaigns.", 3),
        (FAQCategory.YACHT, "Can I charter my yacht while it's insured?",
         "Occasional private charter (typically up to 30 days per year) can be covered by endorsement. Regular commercial charter (more than 30 days or for profit) requires a specialist charter endorsement and may require a higher premium. Please advise if charter is planned when requesting your quote.", 4),
        (FAQCategory.YACHT, "What areas does my yacht policy cover?",
         "Standard policies cover home waters (typically 60 miles from the home port) and can be extended to coastal European waters, Atlantic (including Canaries/Azores), and worldwide. Navigating outside your agreed area invalidates cover, so always check before passages.", 5),

        # ── CLAIMS
        (FAQCategory.CLAIMS, "How do I make a claim?",
         "Call our 24/7 claims line on +1 (800) 911-WAVE as soon as possible after an incident. For non-urgent claims, you can also email claims@skywave-insurance.com. Please have your policy number to hand. We will appoint a dedicated claims handler within 2 hours of notification.", 1),
        (FAQCategory.CLAIMS, "How quickly are claims settled?",
         "We aim to settle straightforward claims within 14 days of receipt of all required documentation. Complex claims (large loss, liability disputes, third-party involvement) may take longer. Your claims handler will keep you updated throughout the process.", 2),
        (FAQCategory.CLAIMS, "What documentation do I need to make a claim?",
         "Typically: your policy number, a completed claim form, photographs of the damage, any third-party details (if applicable), a repair estimate from an approved repairer, and any police report number (for theft or collision claims). Your claims handler will advise on specific requirements.", 3),
        (FAQCategory.CLAIMS, "Will making a claim affect my no-claims discount?",
         "Claims may affect your no-claims discount at renewal. The impact depends on the number and value of claims during the policy period. Fault-free claims (where we recover costs from a third party) do not typically affect NCD. Protected NCD is available as an optional extra.", 4),

        # ── BILLING
        (FAQCategory.BILLING, "How can I pay my premium?",
         "Premiums can be paid by bank transfer, credit/debit card, or Direct Debit. We offer monthly Direct Debit instalment plans at no additional cost for annual premiums over £500. Please contact your account manager to set up a payment plan.", 1),
        (FAQCategory.BILLING, "When is my premium due?",
         "Annual premiums are typically due within 30 days of the policy inception date. For monthly Direct Debit plans, the first payment is taken on inception and subsequent payments on the same date each month. Failure to pay may result in policy cancellation.", 2),
        (FAQCategory.BILLING, "Can I pay monthly?",
         "Yes. Monthly Direct Debit plans are available for all annual premium-paying policies. We charge no interest or arrangement fee on monthly plans. Please ask your account manager to set this up at inception or renewal.", 3),
    ]

    created = 0
    for category, question, answer, order in faqs_data:
        faq, new = FAQ.objects.get_or_create(
            question=question,
            defaults={"category": category, "answer": answer, "order": order, "is_active": True}
        )
        if new:
            created += 1
            stdout.write(ok(f"Created FAQ [{category}]: {question[:60]}…"))
        else:
            stdout.write(warn(f"FAQ already exists — skipped: {question[:50]}"))

    stdout.write(info(f"FAQs: {created} created\n"))


def seed_testimonials(stdout):
    """Create client testimonials."""

    testimonials_data = [
        {
            "client_name": "Jonathan Hartley",
            "client_title": "Group Fleet Manager",
            "company": "Hartley Nationwide Logistics",
            "service_category": ServiceCategory.FLEET,
            "content": (
                "We moved our 63-vehicle fleet to SkyWave three years ago after a frustrating "
                "experience with a generalist insurer. The difference is night and day. Our "
                "account manager knows our fleet inside out — she was even able to flag a "
                "claims pattern we hadn't noticed ourselves. Claims are handled quickly and "
                "without argument. Premium came in 12% lower than our previous insurer at "
                "renewal this year."
            ),
            "rating": 5,
            "is_featured": True,
        },
        {
            "client_name": "Sophie Leclerc",
            "client_title": "Owner / Chief Pilot",
            "company": "Leclerc Air Services",
            "service_category": ServiceCategory.AIRCRAFT,
            "content": (
                "I've been flying commercially for 22 years and SkyWave is the first aviation "
                "insurer I've worked with that genuinely understands aviation operations. They "
                "didn't just read our AOC — they asked the right questions about our crew "
                "training programme, our maintenance standards and our route network. When we "
                "had a birdstrike last year, the claim was paid within 10 days. Outstanding."
            ),
            "rating": 5,
            "is_featured": True,
        },
        {
            "client_name": "Theo Vandermeer",
            "client_title": "Owner",
            "company": "",
            "service_category": ServiceCategory.YACHT,
            "content": (
                "My 22m ketch is my home and my passion. I couldn't find an insurer willing "
                "to cover both my extended liveaboard lifestyle AND serious offshore racing "
                "until SkyWave. They wrote a single clean policy that covers everything — "
                "Atlantic passages, racing in the Azores Race, liveaboard, the lot. "
                "The price was very fair given the breadth of cover."
            ),
            "rating": 5,
            "is_featured": True,
        },
        {
            "client_name": "Naomi Okonkwo",
            "client_title": "Head of Operations",
            "company": "Okonkwo Medical Transport Ltd",
            "service_category": ServiceCategory.FLEET,
            "content": (
                "As a specialist medical transport operator, we needed more than just "
                "standard fleet cover. SkyWave understood our liability exposure and wrote "
                "cover that actually reflects what we do. The claims team handled a complex "
                "third-party liability claim professionally and achieved a settlement that "
                "protected our business."
            ),
            "rating": 5,
            "is_featured": False,
        },
        {
            "client_name": "Marco Bianchi",
            "client_title": "CEO",
            "company": "BianchiAir Srl",
            "service_category": ServiceCategory.AIRCRAFT,
            "content": (
                "We operate three aircraft on charter in Italy and France. SkyWave placed "
                "a programme that covered all three under a single policy with territory "
                "limited to Europe but with an option to extend for transatlantic positioning "
                "flights. The flexibility is exactly what we needed."
            ),
            "rating": 4,
            "is_featured": False,
        },
        {
            "client_name": "Ingrid Lindqvist",
            "client_title": "Chief Financial Officer",
            "company": "Lindqvist Family Office",
            "service_category": ServiceCategory.YACHT,
            "content": (
                "Our 38m superyacht requires a level of insurance expertise that most markets "
                "simply don't have. SkyWave's marine team conducted a vessel survey, provided "
                "a competitive all-risks hull policy with full charter endorsement, and "
                "arranged P&I with a leading club — all within two weeks. Exceptional service."
            ),
            "rating": 5,
            "is_featured": True,
        },
    ]

    created = 0
    for data in testimonials_data:
        t, new = Testimonial.objects.get_or_create(
            client_name=data["client_name"],
            company=data["company"],
            defaults=data
        )
        if new:
            created += 1
            stdout.write(ok(f"Created testimonial: {data['client_name']}"))
        else:
            stdout.write(warn(f"Testimonial for {data['client_name']} already exists — skipped"))

    stdout.write(info(f"Testimonials: {created} created\n"))


def seed_team(stdout):
    """Create team members."""

    team_data = [
        {
            "name": "Alexandra Stone",
            "role": "Chief Executive Officer",
            "department": "Executive",
            "bio": "Alexandra co-founded SkyWave in 1999 after 10 years as a Lloyd's underwriter. She has overseen the company's growth from a two-person Lloyd's box to a 120-person specialist insurer with offices on three continents.",
            "linkedin_url": "https://linkedin.com/in/alexandra-stone-skywave",
            "email": "a.stone@skywave-insurance.com",
            "order": 1,
        },
        {
            "name": "Marcus Flynn",
            "role": "Chief Underwriting Officer",
            "department": "Underwriting",
            "bio": "Marcus joined SkyWave in 2005 from the Lloyd's aviation market. He oversees underwriting strategy across all three divisions and chairs the Underwriting Committee.",
            "linkedin_url": "https://linkedin.com/in/marcus-flynn-cuo",
            "email": "m.flynn@skywave-insurance.com",
            "order": 2,
        },
        {
            "name": "Priya Nair",
            "role": "Head of Marine Underwriting",
            "department": "Marine Division",
            "bio": "Priya leads our yacht and superyacht underwriting team. An avid sailor herself (RYA Yachtmaster Ocean), she brings 15 years of specialist marine underwriting experience to SkyWave.",
            "email": "p.nair@skywave-insurance.com",
            "order": 3,
        },
        {
            "name": "James Okafor",
            "role": "Head of Aviation Underwriting",
            "department": "Aviation",
            "bio": "James holds a Commercial Pilot Licence and an ACII qualification — a rare combination that gives him deep operational and insurance insight. He manages our global aviation portfolio.",
            "linkedin_url": "https://linkedin.com/in/james-okafor-aviation",
            "email": "j.okafor@skywave-insurance.com",
            "order": 4,
        },
        {
            "name": "Thomas Wright",
            "role": "Head of Claims",
            "department": "Claims",
            "bio": "Tom joined SkyWave in 2010 from a loss adjusting background in complex property and marine claims. He has overseen major loss events across all three divisions and leads our 24/7 claims response team.",
            "email": "t.wright@skywave-insurance.com",
            "order": 5,
        },
        {
            "name": "Lucia Moreno",
            "role": "Client Services Director",
            "department": "Customer Success",
            "bio": "Lucia ensures every SkyWave client receives a premium service experience. She manages our account management team and leads our annual client satisfaction programme.",
            "linkedin_url": "https://linkedin.com/in/lucia-moreno-skywave",
            "email": "l.moreno@skywave-insurance.com",
            "order": 6,
        },
    ]

    created = 0
    for data in team_data:
        member, new = TeamMember.objects.get_or_create(name=data["name"], defaults=data)
        if new:
            created += 1
            stdout.write(ok(f"Created team member: {data['name']} — {data['role']}"))
        else:
            stdout.write(warn(f"Team member {data['name']} already exists — skipped"))

    stdout.write(info(f"Team members: {created} created\n"))


# ═══════════════════════════════════════════════════════════════════════════
# Management Command
# ═══════════════════════════════════════════════════════════════════════════

SEED_MAP = {
    "users":        seed_users,
    "services":     seed_services,
    "inquiries":    seed_inquiries,
    "contacts":     seed_contacts,
    "jobs":         seed_jobs,
    "applications": seed_applications,
    "faqs":         seed_faqs,
    "testimonials": seed_testimonials,
    "team":         seed_team,
}


class Command(BaseCommand):
    help = (
        "Seed the database with realistic sample data.\n\n"
        "Examples:\n"
        "  python manage.py seed_data                    # seed everything\n"
        "  python manage.py seed_data --model users      # seed one model group\n"
        "  python manage.py seed_data --flush            # wipe all data first\n"
        "  python manage.py seed_data --flush --model team\n"
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--model",
            choices=list(SEED_MAP.keys()),
            help="Seed only this model group (omit to seed all).",
        )
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing data for the target model(s) before seeding.",
        )

    def handle(self, *args, **options):
        model_key = options.get("model")
        do_flush  = options.get("flush", False)

        self.stdout.write(
            f"\n{BOLD}{'='*60}{RESET}\n"
            f"{BOLD}  SkyWave Insurance — Database Seeder{RESET}\n"
            f"{BOLD}{'='*60}{RESET}\n"
        )

        targets = {model_key: SEED_MAP[model_key]} if model_key else SEED_MAP

        if do_flush:
            self.stdout.write(warn("--flush specified — deleting existing data...\n"))
            self._flush(list(targets.keys()))

        with transaction.atomic():
            for key, fn in targets.items():
                self.stdout.write(f"{BOLD}{CYAN}── Seeding: {key.upper()}{RESET}")
                fn(self.stdout)

        self.stdout.write(
            f"{BOLD}{GREEN}\n✔  Seeding complete!{RESET}\n"
            f"\n{BOLD}Default credentials:{RESET}\n"
            f"  Admin   → admin@skywave.com       / Admin@12345\n"
            f"  Manager → manager@skywave.com     / Manager@12345\n"
            f"  Staff   → sarah@skywave.com       / Staff@12345\n\n"
            f"  Django admin → http://localhost:8000/admin/\n"
            f"  API docs     → http://localhost:8000/api/docs/\n"
            f"  Staff portal → http://localhost:5173/admin/login\n\n"
        )

    def _flush(self, keys):
        """Remove existing records for the given model groups."""
        FLUSH_MAP = {
            "users":        lambda: User.objects.exclude(is_superuser=True).delete(),
            "services":     lambda: Service.objects.all().delete(),
            "inquiries":    lambda: Inquiry.objects.all().delete(),
            "contacts":     lambda: ContactMessage.objects.all().delete(),
            "jobs":         lambda: JobPosting.objects.all().delete(),
            "applications": lambda: JobApplication.objects.all().delete(),
            "faqs":         lambda: FAQ.objects.all().delete(),
            "testimonials": lambda: Testimonial.objects.all().delete(),
            "team":         lambda: TeamMember.objects.all().delete(),
        }
        for key in keys:
            if key in FLUSH_MAP:
                FLUSH_MAP[key]()
                self.stdout.write(warn(f"Flushed: {key}"))
        self.stdout.write("")