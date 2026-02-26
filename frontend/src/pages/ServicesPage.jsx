import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesService } from '../services/api';

const CATEGORY_INFO = {
  fleet: {
    icon: 'bi-truck',
    color: '#1a3a6b',
    label: 'Fleet Insurance',
    tagline: 'One policy. Every vehicle. Zero gaps.',
  },
  aircraft: {
    icon: 'bi-airplane',
    color: '#4a8fc1',
    label: 'Aircraft Insurance',
    tagline: 'From propeller to jet — in the air and on the ground.',
  },
  yacht: {
    icon: 'bi-water',
    color: '#c9a84c',
    label: 'Yacht & Marine Insurance',
    tagline: 'All-risks cover wherever the tide takes you.',
  },
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    servicesService.list().then(({ data }) => {
      setServices(data.results || data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const displayed = filter === 'all' ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <Helmet>
        <title>Insurance Services – Fleet, Aircraft & Yacht | SkyWave Insurance</title>
        <meta name="description" content="Explore SkyWave Insurance's specialist products: commercial fleet insurance, private and commercial aircraft insurance, and luxury yacht marine insurance." />
        <meta property="og:title" content="Insurance Services – SkyWave Insurance" />
        <link rel="canonical" href="https://www.skywave-insurance.com/services" />
      </Helmet>

      <div className="page-hero">
        <div className="container fade-in-up">
          <span className="section-label">Our Services</span>
          <h1 className="display-2 text-white">Specialist Insurance<br />for Exceptional Assets</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540, marginTop: '1rem' }}>
            Three focused disciplines. Unmatched depth of expertise. Every policy built from the ground up for your specific asset and risk profile.
          </p>
        </div>
      </div>

      {/* Category overview */}
      <section className="section-sm" style={{ background: 'var(--sw-off-white)' }}>
        <div className="container">
          <div className="grid-3">
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <button key={key}
                className={`sw-cat-pill${filter === key ? ' sw-cat-pill--active' : ''}`}
                onClick={() => setFilter(filter === key ? 'all' : key)}
              >
                <i className={`bi ${info.icon}`} style={{ color: filter === key ? '#fff' : info.color }} />
                <div>
                  <strong>{info.label}</strong>
                  <span>{info.tagline}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
          ) : displayed.length === 0 ? (
            <div className="text-center" style={{ padding: '4rem' }}>
              <i className="bi bi-grid" style={{ fontSize: '3rem', color: 'var(--sw-border)', display: 'block', marginBottom: '1rem' }} />
              <p className="text-muted">No services found for this category.</p>
            </div>
          ) : (
            <div className="grid-3">
              {displayed.map((s) => {
                const info = CATEGORY_INFO[s.category] || {};
                return (
                  <div key={s.id} className="sw-service-card">
                    <div className="sw-service-card__header" style={{ background: `linear-gradient(135deg, ${info.color || 'var(--sw-navy)'}, var(--sw-navy))` }}>
                      <i className={`bi ${s.icon || info.icon || 'bi-shield-check'}`} />
                      <span className="badge badge-gold">{s.category_display}</span>
                    </div>
                    <div className="sw-service-card__body">
                      <h3>{s.title}</h3>
                      <p>{s.short_description}</p>
                      {Array.isArray(s.features) && s.features.length > 0 && (
                        <ul className="sw-service-card__features">
                          {s.features.slice(0, 4).map((f, i) => (
                            <li key={i}><i className="bi bi-check2-circle" /> {f}</li>
                          ))}
                        </ul>
                      )}
                      <div className="sw-service-card__footer">
                        <Link to={`/services/${s.slug}`} className="btn btn-navy btn-sm">
                          Learn More <i className="bi bi-arrow-right" />
                        </Link>
                        <Link to="/get-quote" className="btn btn-outline btn-sm">
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* No-account notice */}
      <section className="section-sm" style={{ background: 'var(--sw-gold-pale)' }}>
        <div className="container flex-center gap-4 flex-wrap">
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>No Account Needed to Inquire</h3>
            <p style={{ color: 'var(--sw-text-muted)', fontSize: '0.9rem' }}>
              Submit an inquiry or contact us — no sign-up required. Our specialists will reach out within 24 hours.
            </p>
          </div>
          <Link to="/get-quote" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <i className="bi bi-send" /> Submit Inquiry
          </Link>
        </div>
      </section>

      <style>{`
        .sw-cat-pill {
          display: flex; align-items: center; gap: 1rem;
          background: #fff; border: 1.5px solid var(--sw-border);
          border-radius: var(--radius-md); padding: 1.25rem 1.5rem;
          text-align: left; cursor: pointer; transition: var(--transition);
          width: 100%;
        }
        .sw-cat-pill:hover { border-color: var(--sw-navy); box-shadow: var(--shadow-sm); }
        .sw-cat-pill--active { border-color: var(--sw-navy); background: var(--sw-navy); }
        .sw-cat-pill--active strong, .sw-cat-pill--active span { color: #fff; }
        .sw-cat-pill i { font-size: 1.6rem; flex-shrink: 0; }
        .sw-cat-pill strong { display: block; font-size: 0.9rem; color: var(--sw-text); }
        .sw-cat-pill span { display: block; font-size: 0.78rem; color: var(--sw-text-muted); margin-top: 2px; }
        .sw-cat-pill--active span { color: rgba(255,255,255,0.7); }

        .sw-service-card { background: #fff; border: 1px solid var(--sw-border); border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); display: flex; flex-direction: column; }
        .sw-service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .sw-service-card__header {
          padding: 2rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sw-service-card__header i { font-size: 2.5rem; color: rgba(255,255,255,0.9); }
        .sw-service-card__body { padding: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
        .sw-service-card__body h3 { font-size: 1.2rem; }
        .sw-service-card__body > p { font-size: 0.87rem; color: var(--sw-text-muted); line-height: 1.7; }
        .sw-service-card__features { list-style: none; }
        .sw-service-card__features li { font-size: 0.82rem; color: var(--sw-text-muted); display: flex; align-items: flex-start; gap: 0.4rem; margin-bottom: 0.3rem; }
        .sw-service-card__features i { color: var(--sw-success); margin-top: 2px; flex-shrink: 0; }
        .sw-service-card__footer { display: flex; gap: 0.75rem; margin-top: auto; padding-top: 0.5rem; }
      `}</style>
    </>
  );
}