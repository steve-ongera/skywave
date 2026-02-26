import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { testimonialService } from '../services/api';

// ── Static data ───────────────────────────────────────────────────────────────

const stats = [
  { value: '25+',    label: 'Years of Expertise',   icon: 'bi-award-fill' },
  { value: '3,200+', label: 'Active Policies',       icon: 'bi-shield-fill-check' },
  { value: '98%',    label: 'Claims Satisfaction',   icon: 'bi-star-fill' },
  { value: '120+',   label: 'Countries Covered',     icon: 'bi-globe2' },
];

const divisions = [
  {
    slug: 'fleet-insurance',
    icon: 'bi-truck-front-fill',
    label: 'Fleet',
    title: 'Commercial Fleet Insurance',
    desc: 'One policy. Every vehicle. From light vans to heavy goods vehicles, we underwrite fleets of all sizes under a single, clean policy structure with one renewal date.',
    highlights: ['Fleets from 3 vehicles', 'EV & hybrid expertise', 'Telematics discounts', 'Goods-in-transit'],
    img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
    accent: '#4a8fc1',
  },
  {
    slug: 'aircraft-insurance',
    icon: 'bi-airplane-fill',
    label: 'Aviation',
    title: 'Aircraft & Aviation Insurance',
    desc: 'Hull all-risks, passenger liability, and war cover for private jets, helicopters, turboprops, and commercial airline fleets — underwritten by dedicated aviation specialists.',
    highlights: ['Agreed hull value', 'Liability up to $500m', 'War & terrorism cover', 'AOG 24/7 support'],
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    accent: '#c9a84c',
  },
  {
    slug: 'yacht-insurance',
    icon: 'bi-water',
    label: 'Marine',
    title: 'Yacht & Marine Insurance',
    desc: 'All-risks hull cover for sailing yachts, motor yachts, and superyachts — from home waters to ocean-going passages. Racing, liveaboard, and charter endorsements available.',
    highlights: ['Agreed value hull cover', 'Worldwide navigation', 'Racing & offshore cover', 'Charter endorsements'],
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    accent: '#1db87c',
  },
];

const whyUs = [
  { icon: 'bi-bullseye',            title: 'Domain Expertise',       desc: 'Our underwriters have spent entire careers in fleet, aviation, or marine — never generalists.' },
  { icon: 'bi-lightning-charge-fill', title: '2-Hour Claims Response', desc: 'A dedicated handler assigned within 2 hours. Most claims resolved in 14 days.' },
  { icon: 'bi-globe2',              title: '120+ Countries',          desc: 'Global underwriting capacity with local expertise in every major hub.' },
  { icon: 'bi-sliders',             title: 'Bespoke Policies',        desc: 'Every policy is individually rated — no blanket premiums, no generic wordings.' },
  { icon: 'bi-headset',             title: '24 / 7 Support',          desc: 'Your account manager and emergency claims line are available every hour of every day.' },
  { icon: 'bi-trophy-fill',         title: 'Award-Winning',           desc: 'Insurance Provider of the Year — Lloyd\'s Market Association, three years running.' },
];

const partners = [
  { name: "Lloyd's of London",  logo: "Lloyd's" },
  { name: 'AXA XL',            logo: 'AXA XL' },
  { name: 'Swiss Re',          logo: 'Swiss Re' },
  { name: 'Munich Re',         logo: 'Munich Re' },
  { name: 'Allianz',           logo: 'Allianz' },
  { name: 'Zurich Insurance',  logo: 'Zurich' },
];

// ── Animated testimonials carousel ───────────────────────────────────────────

function TestimonialsCarousel({ testimonials }) {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for seamless loop
  const items = [...testimonials, ...testimonials];

  return (
    <div
      className="testimonials-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="testimonials-track"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {items.map((t, i) => (
          <div key={`${t.id}-${i}`} className="testimonial-card">
            <div className="testimonial-card__quote">
              <i className="bi bi-quote" />
            </div>
            <div className="testimonial-card__stars">
              {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                <i key={idx} className="bi bi-star-fill" />
              ))}
            </div>
            <p className="testimonial-card__text">"{t.content}"</p>
            <div className="testimonial-card__author">
              <div className="testimonial-card__avatar">
                {t.avatar
                  ? <img src={t.avatar} alt={t.client_name} />
                  : <span>{t.client_name?.[0]}{t.client_name?.split(' ')[1]?.[0]}</span>
                }
              </div>
              <div>
                <strong>{t.client_name}</strong>
                <span>
                  {t.client_title}
                  {t.company ? `, ${t.company}` : ''}
                </span>
                {t.service_category && (
                  <em className={`testimonial-card__tag tag-${t.service_category}`}>
                    {t.service_category.charAt(0).toUpperCase() + t.service_category.slice(1)}
                  </em>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HomePage() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeDiv, setActiveDiv] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    testimonialService.list({ is_featured: true }).then(({ data }) => {
      const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
      setTestimonials(list);
    }).catch(() => setTestimonials([]));

    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-rotate division tabs
  useEffect(() => {
    const t = setInterval(() => setActiveDiv(d => (d + 1) % divisions.length), 5000);
    return () => clearInterval(t);
  }, []);

  const div = divisions[activeDiv];

  return (
    <>
      <Helmet>
        <title>SkyWave Insurance — Fleet, Aircraft & Yacht Insurance Specialists</title>
        <meta name="description" content="SkyWave Insurance provides specialist insurance for commercial vehicle fleets, private and commercial aircraft, and luxury yachts. Trusted by 3,200+ clients across 120 countries since 1999. Get a bespoke quote today." />
        <meta name="keywords" content="fleet insurance, aircraft insurance, yacht insurance, marine insurance, aviation hull insurance, commercial fleet cover, superyacht insurance, private jet insurance, SkyWave Insurance" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="SkyWave Insurance — Fleet, Aircraft & Yacht Insurance Specialists" />
        <meta property="og:description" content="Specialist high-value asset insurance since 1999. Trusted by 3,200+ clients across 120 countries. Get a tailored quote — no account needed." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80" />
        <meta property="og:url" content="https://www.skywave-insurance.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SkyWave Insurance — Specialist Asset Insurance" />
        <meta name="twitter:description" content="Fleet, aircraft and yacht insurance by specialists who know your industry." />
        <link rel="canonical" href="https://www.skywave-insurance.com/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "InsuranceAgency",
          "name": "SkyWave Insurance",
          "description": "Specialist insurance for commercial fleets, aircraft, and luxury yachts.",
          "url": "https://www.skywave-insurance.com",
          "foundingDate": "1999",
          "areaServed": "Worldwide",
          "telephone": "+1-800-911-9283",
          "address": { "@type": "PostalAddress", "addressCountry": "GB" }
        })}</script>
      </Helmet>

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-hero">
        {/* Background image */}
        <div className="hp-hero__img">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&q=85"
            alt="Commercial aircraft in flight representing SkyWave aviation insurance"
          />
          <div className="hp-hero__overlay" />
        </div>

        {/* Floating accent shapes */}
        <div className="hp-hero__shape hp-hero__shape--1" />
        <div className="hp-hero__shape hp-hero__shape--2" />

        <div className="container hp-hero__body">
          <div className="hp-hero__badge fade-up" style={{ '--d': '0s' }}>
            <i className="bi bi-shield-check" />
            Trusted Since 1999 · Lloyd's Accredited
          </div>
          <h1 className="hp-hero__h1 fade-up" style={{ '--d': '0.12s' }}>
            Where Precision<br />
            Meets <span className="text-gold-grad">Protection</span>
          </h1>
          <p className="hp-hero__sub fade-up" style={{ '--d': '0.24s' }}>
            Specialist insurance for commercial fleets, aircraft, and luxury yachts.<br />
            Tailored coverage built by underwriters who know your industry — not generalists.
          </p>
          <div className="hp-hero__ctas fade-up" style={{ '--d': '0.36s' }}>
            <Link to="/get-quote" className="btn-hero-primary">
              <i className="bi bi-clipboard2-check-fill" />
              Get a Free Quote
            </Link>
            <Link to="/services" className="btn-hero-outline">
              <i className="bi bi-grid-3x3-gap-fill" />
              Explore Cover
            </Link>
          </div>
          <div className="hp-hero__assurances fade-up" style={{ '--d': '0.48s' }}>
            {['No account needed', '24-hour response', '120+ countries'].map(a => (
              <span key={a}><i className="bi bi-check-circle-fill" />{a}</span>
            ))}
          </div>
        </div>

        <div className="hp-hero__scroll">
          <span>Scroll</span>
          <div className="hp-hero__scroll-line" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS RIBBON
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-ribbon">
        <div className="container hp-ribbon__grid">
          {stats.map((s, i) => (
            <div key={s.label} className="hp-ribbon__item" style={{ '--i': i }}>
              <i className={`bi ${s.icon}`} />
              <div>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DIVISIONS (interactive tab)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-divisions section">
        <div className="container">
          <div className="hp-sec-header">
            <span className="hp-eyebrow">What We Cover</span>
            <h2 className="hp-h2">Three Pillars of<br />Specialist Insurance</h2>
            <p className="hp-lead">
              Each division is led by underwriters with careers dedicated to a single asset class.
              That depth translates to better cover, fairer pricing, and faster claims.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="hp-div-tabs">
            {divisions.map((d, i) => (
              <button
                key={d.slug}
                className={`hp-div-tab ${i === activeDiv ? 'hp-div-tab--active' : ''}`}
                onClick={() => setActiveDiv(i)}
                style={{ '--accent': d.accent }}
              >
                <i className={`bi ${d.icon}`} />
                {d.label}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <div className="hp-div-panel" key={activeDiv}>
            <div className="hp-div-panel__img">
              <img src={div.img} alt={div.title} />
              <div className="hp-div-panel__img-badge">
                <i className={`bi ${div.icon}`} />
              </div>
            </div>
            <div className="hp-div-panel__content">
              <h3 className="hp-div-panel__title">{div.title}</h3>
              <p className="hp-div-panel__desc">{div.desc}</p>
              <ul className="hp-div-panel__highlights">
                {div.highlights.map(h => (
                  <li key={h}><i className="bi bi-check-circle-fill" />{h}</li>
                ))}
              </ul>
              <div className="hp-div-panel__actions">
                <Link to={`/services/${div.slug}`} className="btn-div-primary" style={{ '--accent': div.accent }}>
                  Explore {div.label} Cover <i className="bi bi-arrow-right" />
                </Link>
                <Link to="/get-quote" className="btn-div-ghost">
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PROCESS / HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-process section" style={{ background: 'var(--sw-off-white)' }}>
        <div className="container">
          <div className="hp-sec-header">
            <span className="hp-eyebrow">The SkyWave Process</span>
            <h2 className="hp-h2">Cover in Four Steps</h2>
            <p className="hp-lead">No jargon. No unnecessary paperwork. No account required.</p>
          </div>
          <div className="hp-steps">
            {[
              { n: '01', icon: 'bi-clipboard2-text', title: 'Submit Your Inquiry', desc: 'Tell us about your asset — fleet size, aircraft type, yacht length. No account or login required.' },
              { n: '02', icon: 'bi-person-check', title: 'Specialist Review', desc: 'A dedicated underwriter with domain expertise reviews your risk within 24 hours.' },
              { n: '03', icon: 'bi-file-earmark-text', title: 'Bespoke Quotation', desc: 'Receive a personalised, itemised quotation — not a generic price.' },
              { n: '04', icon: 'bi-shield-fill-check', title: 'Covered', desc: 'Bind cover same-day. Policy documents issued within 2 hours of acceptance.' },
            ].map((step, i) => (
              <div key={step.n} className="hp-step">
                <div className="hp-step__num">{step.n}</div>
                <div className="hp-step__icon"><i className={`bi ${step.icon}`} /></div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {i < 3 && <div className="hp-step__connector" />}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/get-quote" className="btn-cta-primary">
              Start Your Inquiry <i className="bi bi-arrow-right-circle-fill" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY SKYWAVE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-why section">
        <div className="container">
          <div className="hp-why__inner">
            <div className="hp-why__left">
              <span className="hp-eyebrow">Why SkyWave</span>
              <h2 className="hp-h2" style={{ color: '#fff' }}>
                The Specialist<br />Advantage
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Generic insurers apply generic solutions. SkyWave exists for one reason: to provide 
                deep specialist cover for complex, high-value assets that standard markets handle poorly.
                Our entire business is built around three asset classes — and nothing else.
              </p>
              <div className="hp-why__quote">
                <blockquote>
                  "The difference between a specialist insurer and a generalist is felt most acutely
                  at the moment of a claim. That's when expertise truly matters."
                </blockquote>
                <cite>— Marcus Flynn, Chief Underwriting Officer</cite>
              </div>
              <Link to="/about" className="btn-why-outline">
                <i className="bi bi-building" /> Our Story
              </Link>
            </div>
            <div className="hp-why__grid">
              {whyUs.map((item, i) => (
                <div key={item.title} className="hp-why__card" style={{ '--i': i }}>
                  <i className={`bi ${item.icon}`} />
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS — animated horizontal carousel
      ═══════════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="hp-testimonials section">
          <div className="container">
            <div className="hp-sec-header">
              <span className="hp-eyebrow">Client Voices</span>
              <h2 className="hp-h2">Trusted by Industry Leaders</h2>
              <p className="hp-lead">
                Hover to pause. Over 3,200 clients across fleet, aviation, and marine sectors.
              </p>
            </div>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PARTNERS / CAPACITY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-partners section" style={{ background: 'var(--sw-off-white)' }}>
        <div className="container">
          <div className="hp-partners__header">
            <span className="hp-eyebrow">Our Capacity Partners</span>
            <p>SkyWave draws on the strength of the world's leading reinsurance markets.</p>
          </div>
          <div className="hp-partners__logos">
            {partners.map(p => (
              <div key={p.name} className="hp-partner-logo" title={p.name}>
                <span>{p.logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SPLIT IMAGE CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-split">
        <div className="hp-split__img">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"
            alt="Luxury yacht at sea — SkyWave marine insurance"
          />
        </div>
        <div className="hp-split__content">
          <span className="hp-eyebrow" style={{ color: 'var(--sw-gold)' }}>Ready to Switch?</span>
          <h2 className="hp-split__h2">
            Better Cover.<br />
            Faster Claims.<br />
            Genuine Expertise.
          </h2>
          <p>
            Submit an inquiry today — no account, no commitment, no jargon.
            One of our specialists will contact you within one business day with a
            tailored quotation.
          </p>
          <div className="hp-split__perks">
            {[
              { icon: 'bi-clock-history',    text: 'Response within 24 hours' },
              { icon: 'bi-person-lines-fill', text: 'Dedicated account manager' },
              { icon: 'bi-file-earmark-check', text: 'Same-day cover available' },
            ].map(p => (
              <div key={p.text} className="hp-split__perk">
                <i className={`bi ${p.icon}`} />
                <span>{p.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/get-quote" className="btn-cta-primary">
              Get a Free Quote <i className="bi bi-arrow-right" />
            </Link>
            <Link to="/contact" className="btn-cta-ghost">
              Talk to a Specialist
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          LATEST / INDUSTRIES SERVED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-industries section">
        <div className="container">
          <div className="hp-sec-header">
            <span className="hp-eyebrow">Industries We Serve</span>
            <h2 className="hp-h2">Built for Your Sector</h2>
          </div>
          <div className="hp-ind-grid">
            {[
              { img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80', title: 'Logistics & Freight', tag: 'Fleet', desc: 'HGVs, curtainsiders, refrigerated units, and mixed fleets.' },
              { img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=80', title: 'Business Aviation', tag: 'Aviation', desc: 'Owner-flown jets, managed fleets, charter and ACMI operators.' },
              { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: 'Superyacht Owners', tag: 'Marine', desc: 'All-risks hull, P&I, charter hire, and crew liability.' },
              { img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80', title: 'Public Sector Fleets', tag: 'Fleet', desc: 'Local authorities, NHS trusts, and emergency services.' },
              { img: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=80', title: 'Regional Airlines', tag: 'Aviation', desc: 'Narrowbody and turboprop operators, AOC holders.' },
              { img: 'https://images.unsplash.com/photo-1548533348-4b57ef61bd64?w=600&q=80', title: 'Offshore Racing', tag: 'Marine', desc: 'Fastnet, ARC, Rolex Sydney Hobart — and more.' },
            ].map(ind => (
              <div key={ind.title} className="hp-ind-card">
                <div className="hp-ind-card__img">
                  <img src={ind.img} alt={ind.title} loading="lazy" />
                  <span className={`hp-ind-card__tag tag-${ind.tag.toLowerCase()}`}>{ind.tag}</span>
                </div>
                <div className="hp-ind-card__body">
                  <h4>{ind.title}</h4>
                  <p>{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hp-final-cta">
        <div className="hp-final-cta__bg">
          <img
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1800&q=80"
            alt=""
            aria-hidden="true"
          />
          <div className="hp-final-cta__overlay" />
        </div>
        <div className="container hp-final-cta__content">
          <h2>Ready for Better Coverage?</h2>
          <p>
            Submit an inquiry in minutes. No account required. A specialist will
            respond within one business day with a bespoke quotation.
          </p>
          <div className="hp-final-cta__btns">
            <Link to="/get-quote" className="btn-hero-primary">
              <i className="bi bi-clipboard2-check-fill" /> Get a Free Quote
            </Link>
            <Link to="/contact" className="btn-hero-outline">
              <i className="bi bi-chat-dots-fill" /> Speak to a Specialist
            </Link>
          </div>
          <p className="hp-final-cta__small">
            <i className="bi bi-lock-fill" /> No personal data stored without consent. FCA regulated.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ALL STYLES
      ═══════════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── Globals & helpers ─────────────────────────────────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(10px); }
        }
        @keyframes panLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes divFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          animation: fadeUp 0.7s cubic-bezier(.22,.68,0,1.2) both;
          animation-delay: var(--d, 0s);
        }

        .hp-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--sw-gold);
          margin-bottom: 0.75rem;
        }
        .hp-eyebrow::before {
          content: ''; display: block;
          width: 24px; height: 2px;
          background: var(--sw-gold);
        }
        .hp-h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.15;
          margin-bottom: 1rem;
          color: var(--sw-navy);
        }
        .hp-lead {
          font-size: 1.05rem; color: var(--sw-text-muted);
          max-width: 560px; line-height: 1.75;
        }
        .hp-sec-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .hp-sec-header .hp-eyebrow { justify-content: center; }
        .hp-sec-header .hp-lead { margin: 0 auto; }

        /* ── HERO ──────────────────────────────────────────────────── */
        .hp-hero {
          position: relative;
          min-height: 100vh;
          display: flex; align-items: center;
          overflow: hidden;
          background: var(--sw-navy);
        }
        .hp-hero__img {
          position: absolute; inset: 0;
        }
        .hp-hero__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 30%;
          filter: saturate(0.7) brightness(0.55);
        }
        .hp-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(105deg, rgba(10,22,40,0.92) 40%, rgba(10,22,40,0.55) 100%),
            linear-gradient(0deg, rgba(10,22,40,0.6) 0%, transparent 50%);
        }
        .hp-hero__shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .hp-hero__shape--1 {
          width: 500px; height: 500px;
          background: rgba(74,143,193,0.15);
          top: -100px; right: -100px;
        }
        .hp-hero__shape--2 {
          width: 400px; height: 400px;
          background: rgba(201,168,76,0.1);
          bottom: 100px; right: 200px;
        }
        .hp-hero__body {
          position: relative; z-index: 2;
          padding: 9rem 0 7rem;
          max-width: 780px;
        }
        .hp-hero__badge {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 999px;
          padding: 0.4rem 1.1rem;
          font-size: 0.75rem; font-weight: 600;
          color: var(--sw-gold);
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 1.75rem;
        }
        .hp-hero__h1 {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 6vw, 5rem);
          line-height: 1.1;
          color: #fff;
          margin-bottom: 0;
        }
        .text-gold-grad {
          background: linear-gradient(90deg, var(--sw-gold), #e8c86a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hp-hero__sub {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: rgba(255,255,255,0.68);
          margin: 1.75rem 0 2.5rem;
          line-height: 1.85;
        }
        .hp-hero__ctas { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }

        .btn-hero-primary {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: var(--sw-gold);
          color: var(--sw-navy);
          padding: 0.9rem 2.2rem;
          border-radius: var(--radius-md);
          font-weight: 700; font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }
        .btn-hero-primary:hover { background: #d9b85c; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.4); }

        .btn-hero-outline {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: transparent;
          color: #fff;
          padding: 0.9rem 2rem;
          border-radius: var(--radius-md);
          border: 1.5px solid rgba(255,255,255,0.4);
          font-weight: 600; font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .btn-hero-outline:hover { border-color: #fff; background: rgba(255,255,255,0.08); }

        .hp-hero__assurances {
          display: flex; flex-wrap: wrap; gap: 0.5rem 2rem;
        }
        .hp-hero__assurances span {
          display: flex; align-items: center; gap: 0.45rem;
          font-size: 0.82rem; color: rgba(255,255,255,0.55);
        }
        .hp-hero__assurances i { color: var(--sw-gold); font-size: 0.85rem; }

        .hp-hero__scroll {
          position: absolute; bottom: 2.5rem; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          color: rgba(255,255,255,0.4);
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          animation: scrollBounce 2.5s ease-in-out infinite;
        }
        .hp-hero__scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
        }

        /* ── RIBBON ────────────────────────────────────────────────── */
        .hp-ribbon {
          background: var(--sw-gold);
          padding: 0;
        }
        .hp-ribbon__grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
        }
        .hp-ribbon__item {
          display: flex; align-items: center; gap: 1.1rem;
          padding: 1.6rem 2rem;
          transition: background 0.2s;
        }
        .hp-ribbon__item:hover { background: rgba(10,22,40,0.06); }
        .hp-ribbon__item + .hp-ribbon__item {
          border-left: 1px solid rgba(10,22,40,0.12);
        }
        .hp-ribbon__item i { font-size: 2rem; color: var(--sw-navy); flex-shrink: 0; }
        .hp-ribbon__item strong {
          display: block; font-family: var(--font-display);
          font-size: 1.6rem; color: var(--sw-navy); line-height: 1;
        }
        .hp-ribbon__item span {
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: rgba(10,22,40,0.6);
        }
        @media (max-width: 900px) {
          .hp-ribbon__grid { grid-template-columns: repeat(2,1fr); }
          .hp-ribbon__item + .hp-ribbon__item { border-left: none; }
          .hp-ribbon__item:nth-child(2n+1) + .hp-ribbon__item { border-left: 1px solid rgba(10,22,40,0.12); }
        }
        @media (max-width: 480px) {
          .hp-ribbon__grid { grid-template-columns: 1fr; }
          .hp-ribbon__item + .hp-ribbon__item { border-left: none; border-top: 1px solid rgba(10,22,40,0.12); }
        }

        /* ── DIVISIONS ─────────────────────────────────────────────── */
        .hp-div-tabs {
          display: flex; justify-content: center; gap: 0.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .hp-div-tab {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 1.75rem;
          border-radius: 999px;
          border: 1.5px solid var(--sw-border);
          background: #fff;
          font-size: 0.88rem; font-weight: 600;
          color: var(--sw-text-muted);
          cursor: pointer; transition: all 0.25s ease;
        }
        .hp-div-tab i { font-size: 1rem; }
        .hp-div-tab:hover { border-color: var(--accent); color: var(--accent); }
        .hp-div-tab--active {
          background: var(--sw-navy); border-color: var(--sw-navy);
          color: #fff;
        }

        .hp-div-panel {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: center;
          animation: divFade 0.5s ease both;
        }
        .hp-div-panel__img {
          position: relative; border-radius: var(--radius-lg);
          overflow: visible;
        }
        .hp-div-panel__img img {
          width: 100%; height: 420px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        .hp-div-panel__img-badge {
          position: absolute; bottom: -16px; right: -16px;
          width: 64px; height: 64px;
          background: var(--sw-gold);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; color: var(--sw-navy);
          box-shadow: 0 8px 24px rgba(201,168,76,0.4);
        }
        .hp-div-panel__title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          margin-bottom: 1rem; color: var(--sw-navy);
        }
        .hp-div-panel__desc {
          font-size: 1rem; color: var(--sw-text-muted);
          line-height: 1.8; margin-bottom: 1.75rem;
        }
        .hp-div-panel__highlights {
          list-style: none; padding: 0; margin: 0 0 2rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;
        }
        .hp-div-panel__highlights li {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.88rem; font-weight: 600; color: var(--sw-navy);
        }
        .hp-div-panel__highlights i { color: var(--sw-gold); font-size: 0.9rem; flex-shrink: 0; }
        .hp-div-panel__actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        .btn-div-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--sw-navy); color: #fff;
          padding: 0.75rem 1.75rem; border-radius: var(--radius-md);
          font-weight: 600; font-size: 0.9rem;
          text-decoration: none; transition: all 0.25s ease;
        }
        .btn-div-primary:hover { background: var(--accent, var(--sw-navy-light)); transform: translateY(-2px); }
        .btn-div-ghost {
          display: inline-flex; align-items: center;
          color: var(--sw-navy); font-weight: 600; font-size: 0.9rem;
          text-decoration: none; padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--sw-border);
          transition: all 0.2s;
        }
        .btn-div-ghost:hover { border-color: var(--sw-navy); }

        @media (max-width: 900px) {
          .hp-div-panel { grid-template-columns: 1fr; gap: 2rem; }
          .hp-div-panel__img img { height: 280px; }
        }

        /* ── PROCESS ───────────────────────────────────────────────── */
        .hp-steps {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 0; position: relative;
        }
        .hp-step {
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
        }
        .hp-step__num {
          font-family: var(--font-display);
          font-size: 3.5rem; font-weight: 700;
          color: rgba(10,22,40,0.06); line-height: 1;
          margin-bottom: 0.75rem;
        }
        .hp-step__icon {
          width: 56px; height: 56px;
          background: var(--sw-navy);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: var(--sw-gold); font-size: 1.4rem;
          margin: 0 auto 1.25rem;
        }
        .hp-step h4 { font-size: 1rem; margin-bottom: 0.5rem; color: var(--sw-navy); }
        .hp-step p { font-size: 0.85rem; color: var(--sw-text-muted); line-height: 1.65; }
        .hp-step__connector {
          position: absolute; top: 56px; right: -1px;
          width: 2px; height: calc(100% - 56px);
          background: var(--sw-border);
          display: none; /* used on mobile instead */
        }
        @media (min-width: 769px) {
          .hp-step__connector {
            display: block;
            top: 4.5rem; right: 0;
            width: 100%; height: 2px;
            background: linear-gradient(90deg, var(--sw-border), transparent);
          }
        }
        @media (max-width: 768px) {
          .hp-steps { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .hp-steps { grid-template-columns: 1fr; }
        }

        .btn-cta-primary {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: var(--sw-navy); color: #fff;
          padding: 0.9rem 2.2rem; border-radius: var(--radius-md);
          font-weight: 700; font-size: 0.95rem;
          text-decoration: none; transition: all 0.25s ease;
        }
        .btn-cta-primary:hover { background: var(--sw-navy-light); transform: translateY(-2px); }
        .btn-cta-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          color: var(--sw-navy); font-weight: 600; font-size: 0.95rem;
          text-decoration: none; padding: 0.9rem 1.5rem;
          border-radius: var(--radius-md); border: 1.5px solid var(--sw-border);
          transition: all 0.2s;
        }
        .btn-cta-ghost:hover { border-color: var(--sw-navy); }

        /* ── WHY ───────────────────────────────────────────────────── */
        .hp-why { background: var(--sw-navy); }
        .hp-why__inner {
          display: grid; grid-template-columns: 1fr 1.4fr;
          gap: 5rem; align-items: start;
        }
        .hp-why .hp-h2 { color: #fff; }
        .hp-why__quote {
          border-left: 3px solid var(--sw-gold);
          padding-left: 1.25rem; margin-bottom: 2rem;
        }
        .hp-why__quote blockquote {
          font-family: var(--font-display);
          font-size: 1.05rem; color: rgba(255,255,255,0.7);
          line-height: 1.7; font-style: italic; margin: 0 0 0.5rem;
        }
        .hp-why__quote cite { font-size: 0.78rem; color: var(--sw-gold); font-style: normal; }
        .btn-why-outline {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: transparent; color: #fff;
          padding: 0.75rem 1.75rem; border-radius: var(--radius-md);
          border: 1.5px solid rgba(255,255,255,0.3);
          font-weight: 600; font-size: 0.9rem;
          text-decoration: none; transition: all 0.2s;
        }
        .btn-why-outline:hover { border-color: #fff; background: rgba(255,255,255,0.06); }
        .hp-why__grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
        }
        .hp-why__card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          transition: all 0.25s ease;
          animation: fadeUp 0.6s ease both;
          animation-delay: calc(var(--i, 0) * 0.07s);
        }
        .hp-why__card:hover { background: rgba(255,255,255,0.07); transform: translateY(-3px); }
        .hp-why__card i { display: block; font-size: 1.4rem; color: var(--sw-gold); margin-bottom: 0.75rem; }
        .hp-why__card h4 { font-size: 0.95rem; color: #fff; margin-bottom: 0.4rem; }
        .hp-why__card p { font-size: 0.82rem; color: rgba(255,255,255,0.5); line-height: 1.65; }

        @media (max-width: 900px) {
          .hp-why__inner { grid-template-columns: 1fr; gap: 3rem; }
        }

        /* ── TESTIMONIALS CAROUSEL ─────────────────────────────────── */
        .hp-testimonials .container { margin-bottom: 2rem; }
        .testimonials-carousel {
          overflow: hidden;
          width: 100%;
          -webkit-mask: linear-gradient(90deg, transparent, #fff 10%, #fff 90%, transparent);
          mask: linear-gradient(90deg, transparent, #fff 10%, #fff 90%, transparent);
        }
        .testimonials-track {
          display: flex; gap: 1.5rem;
          width: max-content;
          animation: panLeft 40s linear infinite;
        }
        .testimonial-card {
          flex-shrink: 0;
          width: 360px;
          background: #fff;
          border: 1px solid var(--sw-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: var(--shadow-sm);
          display: flex; flex-direction: column; gap: 0.85rem;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .testimonial-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }
        .testimonial-card__quote {
          color: var(--sw-gold); font-size: 1.5rem; line-height: 1;
        }
        .testimonial-card__stars {
          display: flex; gap: 2px;
          color: var(--sw-gold); font-size: 0.8rem;
        }
        .testimonial-card__text {
          font-size: 0.9rem; color: var(--sw-text-muted);
          line-height: 1.75; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 4;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .testimonial-card__author {
          display: flex; align-items: center; gap: 0.85rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--sw-border);
        }
        .testimonial-card__avatar {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--sw-navy), var(--sw-navy-light));
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; color: #fff;
          overflow: hidden;
        }
        .testimonial-card__avatar img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .testimonial-card__author strong {
          display: block; font-size: 0.88rem; color: var(--sw-navy);
        }
        .testimonial-card__author span {
          display: block; font-size: 0.75rem; color: var(--sw-text-muted);
          margin-top: 1px;
        }
        .testimonial-card__tag {
          display: inline-block;
          font-size: 0.65rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          margin-top: 3px;
          font-style: normal;
        }
        .tag-fleet    { background: rgba(74,143,193,0.12); color: #4a8fc1; }
        .tag-aircraft { background: rgba(201,168,76,0.15); color: #a07c1e; }
        .tag-yacht, .tag-marine { background: rgba(29,184,124,0.1); color: #1a9a6b; }

        /* ── PARTNERS ──────────────────────────────────────────────── */
        .hp-partners__header { text-align: center; margin-bottom: 2.5rem; }
        .hp-partners__header .hp-eyebrow { justify-content: center; }
        .hp-partners__header p { font-size: 0.9rem; color: var(--sw-text-muted); }
        .hp-partners__logos {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 1rem;
        }
        .hp-partner-logo {
          display: flex; align-items: center; justify-content: center;
          padding: 1rem 2rem;
          background: #fff;
          border: 1px solid var(--sw-border);
          border-radius: var(--radius-md);
          min-width: 130px;
          transition: all 0.2s ease;
        }
        .hp-partner-logo:hover { border-color: var(--sw-navy); box-shadow: var(--shadow-md); }
        .hp-partner-logo span {
          font-family: var(--font-display);
          font-size: 1rem; font-weight: 700;
          color: var(--sw-navy);
          letter-spacing: 0.03em;
        }

        /* ── SPLIT CTA ─────────────────────────────────────────────── */
        .hp-split {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 580px;
        }
        .hp-split__img {
          position: relative; overflow: hidden;
        }
        .hp-split__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .hp-split:hover .hp-split__img img { transform: scale(1.04); }
        .hp-split__content {
          background: var(--sw-navy);
          padding: 5rem 4rem;
          display: flex; flex-direction: column; justify-content: center; gap: 0;
        }
        .hp-split__h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          line-height: 1.2; color: #fff;
          margin: 0.5rem 0 1.5rem;
        }
        .hp-split__content p {
          font-size: 0.95rem; color: rgba(255,255,255,0.6);
          line-height: 1.8; margin-bottom: 2rem;
        }
        .hp-split__perks { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2.5rem; }
        .hp-split__perk {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.88rem; color: rgba(255,255,255,0.8);
        }
        .hp-split__perk i { color: var(--sw-gold); font-size: 1rem; }

        @media (max-width: 900px) {
          .hp-split { grid-template-columns: 1fr; }
          .hp-split__img { height: 300px; }
          .hp-split__content { padding: 3rem 2rem; }
        }

        /* ── INDUSTRIES ────────────────────────────────────────────── */
        .hp-ind-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .hp-ind-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--sw-border);
          background: #fff;
          transition: all 0.3s ease;
        }
        .hp-ind-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .hp-ind-card__img {
          position: relative; height: 200px; overflow: hidden;
        }
        .hp-ind-card__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .hp-ind-card:hover .hp-ind-card__img img { transform: scale(1.07); }
        .hp-ind-card__tag {
          position: absolute; top: 1rem; left: 1rem;
          font-size: 0.65rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 0.25rem 0.7rem; border-radius: 999px;
        }
        .tag-Fleet    { background: rgba(74,143,193,0.9); color: #fff; }
        .tag-Aviation { background: rgba(201,168,76,0.9); color: #fff; }
        .tag-Marine   { background: rgba(29,184,124,0.9); color: #fff; }
        .hp-ind-card__body { padding: 1.25rem 1.5rem; }
        .hp-ind-card__body h4 { font-size: 1rem; margin-bottom: 0.35rem; color: var(--sw-navy); }
        .hp-ind-card__body p { font-size: 0.82rem; color: var(--sw-text-muted); line-height: 1.6; }
        @media (max-width: 900px) { .hp-ind-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .hp-ind-grid { grid-template-columns: 1fr; } }

        /* ── FINAL CTA ─────────────────────────────────────────────── */
        .hp-final-cta {
          position: relative; overflow: hidden;
          padding: 8rem 0;
        }
        .hp-final-cta__bg {
          position: absolute; inset: 0;
        }
        .hp-final-cta__bg img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: saturate(0.6) brightness(0.35);
        }
        .hp-final-cta__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(10,22,40,0.88), rgba(10,22,40,0.72));
        }
        .hp-final-cta__content {
          position: relative; z-index: 2;
          text-align: center; max-width: 680px;
        }
        .hp-final-cta__content h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: #fff; margin-bottom: 1rem;
        }
        .hp-final-cta__content p {
          font-size: 1.05rem; color: rgba(255,255,255,0.65);
          line-height: 1.8; margin-bottom: 2.5rem;
        }
        .hp-final-cta__btns {
          display: flex; justify-content: center;
          gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem;
        }
        .hp-final-cta__small {
          font-size: 0.75rem; color: rgba(255,255,255,0.35);
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        }
        .hp-final-cta__small i { font-size: 0.7rem; }

        /* ── Mobile global ─────────────────────────────────────────── */
        @media (max-width: 768px) {
          .hp-hero__body { padding: 7rem 0 5rem; }
          .hp-hero__h1 { font-size: 2.6rem; }
        }
      `}</style>
    </>
  );
}