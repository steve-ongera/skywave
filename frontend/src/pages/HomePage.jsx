import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesService, testimonialService } from '../services/api';

const stats = [
  { value: '25+', label: 'Years Experience', icon: 'bi-award' },
  { value: '3,200+', label: 'Policies Active', icon: 'bi-shield-check' },
  { value: '98%', label: 'Claim Satisfaction', icon: 'bi-star' },
  { value: '120+', label: 'Countries Covered', icon: 'bi-globe2' },
];

const whyUs = [
  { icon: 'bi-shield-fill-check', title: 'Specialist Expertise', desc: 'Over two decades dedicated exclusively to high-value asset insurance — fleet vehicles, aviation, and marine.' },
  { icon: 'bi-lightning-charge-fill', title: 'Fast Claims Processing', desc: 'Our dedicated claims team responds within 2 hours and resolves most claims within 14 days.' },
  { icon: 'bi-globe2', title: 'Global Reach', desc: 'Underwriting capacity across 120+ countries, with local expertise in every major maritime and aviation hub.' },
  { icon: 'bi-graph-up-arrow', title: 'Bespoke Policies', desc: 'No one-size-fits-all. Every policy is tailored to the precise risk profile of your asset and operations.' },
  { icon: 'bi-headset', title: '24/7 Dedicated Support', desc: 'Your assigned account manager is available around the clock, every day of the year.' },
  { icon: 'bi-trophy', title: 'Award-Winning Service', desc: 'Recognised as Insurance Provider of the Year three consecutive years by Lloyd\'s Market Association.' },
];

const categoryCards = [
  {
    slug: 'fleet-insurance',
    icon: 'bi-truck',
    title: 'Fleet Insurance',
    desc: 'Comprehensive cover for commercial vehicle fleets — from light vans to HGVs. Single policy, maximum simplicity.',
    gradient: 'from-navy to-sky',
  },
  {
    slug: 'aircraft-insurance',
    icon: 'bi-airplane',
    title: 'Aircraft Insurance',
    desc: 'Hull, liability, and passenger cover for private jets, turboprops, helicopters, and commercial aircraft.',
    gradient: 'from-sky to-gold',
  },
  {
    slug: 'yacht-insurance',
    icon: 'bi-water',
    title: 'Yacht & Marine',
    desc: 'All-risks marina and ocean-going cover for sailing yachts, motor yachts, and superyachts worldwide.',
    gradient: 'from-gold to-navy',
  },
];

export default function HomePage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    testimonialService.list({ is_featured: true }).then(({ data }) => {
      // Normalize: paginated response has .results, plain response is an array
      const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
      setTestimonials(list);
    }).catch(() => {
      setTestimonials([]);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>SkyWave Insurance – Fleet, Aircraft & Yacht Insurance Specialists</title>
        <meta name="description" content="SkyWave Insurance offers specialist insurance for commercial fleets, private and commercial aircraft, and luxury yachts. Get a tailored quote today." />
        <meta name="keywords" content="fleet insurance, aircraft insurance, yacht insurance, marine insurance, aviation insurance, SkyWave" />
        <meta property="og:title" content="SkyWave Insurance – Fleet, Aircraft & Yacht" />
        <meta property="og:description" content="Specialist insurance for high-value assets. Trusted by 3,200+ clients across 120 countries." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.skywave-insurance.com/" />
      </Helmet>

      {/* ── HERO ── */}
      <section className="sw-hero">
        <div className="sw-hero__bg" />
        <div className="container sw-hero__content fade-in-up">
          <span className="section-label">Trusted Since 1999</span>
          <h1 className="display-1 text-white">
            Where Precision Meets<br />
            <span className="text-gold">Protection</span>
          </h1>
          <p className="sw-hero__sub">
            Specialist insurance for commercial fleets, aircraft, and luxury yachts.<br className="hide-mobile" />
            Tailored coverage. Global reach. Unwavering claims support.
          </p>
          <div className="sw-hero__ctas">
            <Link to="/get-quote" className="btn btn-primary btn-lg">
              <i className="bi bi-file-earmark-check" /> Get Your Quote
            </Link>
            <Link to="/services" className="btn btn-outline btn-lg">
              <i className="bi bi-grid-3x3-gap" /> Explore Services
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="sw-hero__scroll">
          <i className="bi bi-chevron-double-down" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="sw-stats">
        <div className="container">
          <div className="sw-stats__grid">
            {stats.map((s) => (
              <div key={s.label} className="sw-stats__item">
                <i className={`bi ${s.icon}`} />
                <div>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>What We Cover</span>
            <h2 className="display-2">Three Pillars of<br />Specialist Insurance</h2>
            <p className="text-muted" style={{ maxWidth: 560, margin: '1rem auto 0' }}>
              Each division is led by underwriters with deep domain expertise, ensuring every policy accurately reflects the real risks of your asset class.
            </p>
          </div>
          <div className="grid-3">
            {categoryCards.map((card) => (
              <Link to={`/services/${card.slug}`} key={card.slug} className="sw-category-card">
                <div className="sw-category-card__icon">
                  <i className={`bi ${card.icon}`} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="sw-category-card__cta">
                  Explore Coverage <i className="bi bi-arrow-right" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section" style={{ background: 'var(--sw-off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">Why SkyWave</span>
              <h2 className="heading-xl" style={{ marginBottom: '1rem' }}>
                The Specialist Advantage
              </h2>
              <p className="text-muted" style={{ marginBottom: '2.5rem' }}>
                Generic insurers apply generic solutions. Our entire organisation is built around three complex asset classes — and nothing else. That focused expertise translates directly to better cover, fairer pricing, and faster claims.
              </p>
              <Link to="/about" className="btn btn-navy">
                <i className="bi bi-building" /> Our Story
              </Link>
            </div>
            <div className="grid-2" style={{ gap: '1.25rem' }}>
              {whyUs.map((item) => (
                <div key={item.title} className="sw-feature-card">
                  <i className={`bi ${item.icon}`} />
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>Client Voices</span>
              <h2 className="heading-xl">What Our Clients Say</h2>
            </div>
            <div className="grid-3">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="sw-testimonial-card">
                  <div className="sw-testimonial-card__stars">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <i key={i} className="bi bi-star-fill" />
                    ))}
                  </div>
                  <p>"{t.content}"</p>
                  <div className="sw-testimonial-card__author">
                    <div className="sw-testimonial-card__avatar">
                      {t.client_name?.[0]}
                    </div>
                    <div>
                      <strong>{t.client_name}</strong>
                      <span>{t.client_title}{t.company ? `, ${t.company}` : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="sw-cta-banner">
        <div className="container text-center">
          <h2 className="display-2 text-white">Ready for Better Coverage?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', margin: '1rem 0 2rem' }}>
            Submit an inquiry — no account needed. One of our specialists will respond within 24 hours.
          </p>
          <div className="flex-center gap-3 flex-wrap">
            <Link to="/get-quote" className="btn btn-primary btn-lg">
              <i className="bi bi-clipboard2-check" /> Get a Free Quote
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              <i className="bi bi-chat-dots" /> Talk to a Specialist
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero */
        .sw-hero {
          min-height: 100vh;
          position: relative;
          display: flex; align-items: center;
          background: var(--sw-navy);
          overflow: hidden;
        }
        .sw-hero__bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 70% 50%, rgba(74,143,193,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,168,76,0.12) 0%, transparent 60%),
            linear-gradient(135deg, var(--sw-navy) 0%, var(--sw-navy-mid) 100%);
        }
        .sw-hero__bg::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .sw-hero__content {
          position: relative; z-index: 1;
          padding: 8rem 0 6rem;
          max-width: 720px;
        }
        .sw-hero__sub {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: rgba(255,255,255,0.72);
          margin: 1.5rem 0 2.5rem;
          line-height: 1.8;
        }
        .sw-hero__ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
        .sw-hero__scroll {
          position: absolute; bottom: 2.5rem; left: 50%;
          transform: translateX(-50%);
          color: var(--sw-gold); font-size: 1.2rem;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%  { transform: translateX(-50%) translateY(8px); }
        }

        /* Stats */
        .sw-stats {
          background: var(--sw-gold);
          padding: 1.5rem 0;
        }
        .sw-stats__grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 1rem;
        }
        .sw-stats__item {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.5rem 1rem;
        }
        .sw-stats__item + .sw-stats__item {
          border-left: 1px solid rgba(10,22,40,0.15);
        }
        .sw-stats__item i { font-size: 1.75rem; color: var(--sw-navy); }
        .sw-stats__item strong { display: block; font-size: 1.5rem; font-weight: 700; color: var(--sw-navy); font-family: var(--font-display); }
        .sw-stats__item span { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(10,22,40,0.7); }
        @media (max-width: 768px) { .sw-stats__grid { grid-template-columns: repeat(2,1fr); } .sw-stats__item + .sw-stats__item { border-left: none; } }
        @media (max-width: 400px) { .sw-stats__grid { grid-template-columns: 1fr; } }

        /* Category cards */
        .sw-category-card {
          background: #fff;
          border: 1px solid var(--sw-border);
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          display: flex; flex-direction: column; gap: 1rem;
          transition: var(--transition);
          position: relative; overflow: hidden;
        }
        .sw-category-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, var(--sw-gold), var(--sw-sky));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .sw-category-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .sw-category-card:hover::before { transform: scaleX(1); }
        .sw-category-card__icon {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, var(--sw-navy), var(--sw-navy-light));
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: var(--sw-gold); font-size: 1.5rem;
        }
        .sw-category-card h3 { font-size: 1.3rem; }
        .sw-category-card p { color: var(--sw-text-muted); font-size: 0.9rem; flex: 1; }
        .sw-category-card__cta {
          font-size: 0.83rem; font-weight: 600;
          color: var(--sw-gold);
          text-transform: uppercase; letter-spacing: 0.06em;
          display: flex; align-items: center; gap: 0.4rem;
          transition: var(--transition);
        }
        .sw-category-card:hover .sw-category-card__cta { gap: 0.7rem; }

        /* Feature cards */
        .sw-feature-card {
          background: #fff;
          border: 1px solid var(--sw-border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }
        .sw-feature-card i { font-size: 1.5rem; color: var(--sw-gold); margin-bottom: 0.75rem; display: block; }
        .sw-feature-card h4 { font-size: 1rem; margin-bottom: 0.4rem; }
        .sw-feature-card p { font-size: 0.83rem; color: var(--sw-text-muted); line-height: 1.6; }

        /* Testimonials */
        .sw-testimonial-card {
          background: #fff;
          border: 1px solid var(--sw-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          display: flex; flex-direction: column; gap: 1rem;
          box-shadow: var(--shadow-sm);
        }
        .sw-testimonial-card__stars { color: var(--sw-gold); font-size: 0.9rem; display: flex; gap: 2px; }
        .sw-testimonial-card p { font-size: 0.92rem; color: var(--sw-text-muted); line-height: 1.7; flex: 1; }
        .sw-testimonial-card__author { display: flex; align-items: center; gap: 0.75rem; }
        .sw-testimonial-card__avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--sw-navy-light); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.9rem;
        }
        .sw-testimonial-card__author strong { display: block; font-size: 0.9rem; }
        .sw-testimonial-card__author span { font-size: 0.78rem; color: var(--sw-text-muted); }

        /* CTA Banner */
        .sw-cta-banner {
          background: linear-gradient(135deg, var(--sw-navy) 0%, var(--sw-navy-light) 100%);
          padding: var(--section-py) 0;
          position: relative; overflow: hidden;
        }
        .sw-cta-banner::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%);
        }
        .sw-cta-banner .container { position: relative; z-index: 1; }

        @media (max-width: 768px) {
          .sw-hero__content { padding: 6rem 0 4rem; }
          .sw-stats__grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 900px) {
          .sw-layout-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}