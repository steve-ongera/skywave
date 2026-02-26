import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesService } from '../services/api';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesService.get(slug).then(({ data }) => setService(data)).catch(() => setService(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner" /></div>;
  if (!service) return (
    <div className="section text-center container">
      <h2>Service not found</h2>
      <Link to="/services" className="btn btn-navy" style={{ marginTop: '1rem' }}>All Services</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{service.title} – SkyWave Insurance</title>
        <meta name="description" content={service.short_description} />
        <meta property="og:title" content={`${service.title} – SkyWave Insurance`} />
        <link rel="canonical" href={`https://www.skywave-insurance.com/services/${slug}`} />
      </Helmet>

      <div className="page-hero">
        <div className="container fade-in-up">
          <Link to="/services" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
            <i className="bi bi-chevron-left" /> All Services
          </Link>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>{service.category_display}</span>
          <h1 className="display-2 text-white">{service.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560, marginTop: '1rem', fontSize: '1.05rem' }}>
            {service.short_description}
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h2 className="heading-lg" style={{ marginBottom: '1.25rem' }}>About This Cover</h2>
            <div style={{ color: 'var(--sw-text-muted)', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {service.full_description}
            </div>

            {Array.isArray(service.features) && service.features.length > 0 && (
              <div style={{ marginTop: '3rem' }}>
                <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>What's Included</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {service.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'var(--sw-off-white)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', alignItems: 'flex-start' }}>
                      <i className="bi bi-check2-circle" style={{ color: 'var(--sw-success)', marginTop: 2, flexShrink: 0 }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'sticky', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'var(--sw-navy)' }}>
              {service.icon && <i className={`bi ${service.icon}`} style={{ fontSize: '3rem', color: 'var(--sw-gold)', display: 'block', marginBottom: '1rem' }} />}
              <h3 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Ready for a Quote?</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                No account required. Fill in our inquiry form and receive a tailored quotation within 24 hours.
              </p>
              <Link to={`/get-quote?category=${service.category}`} className="btn btn-primary w-100" style={{ justifyContent: 'center' }}>
                <i className="bi bi-file-earmark-check" /> Get a Quote
              </Link>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Need to Talk First?</h4>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                <i className="bi bi-telephone" style={{ color: 'var(--sw-gold)', marginTop: 2 }} />
                <span>+1 (800) SKY-WAVE</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                <i className="bi bi-envelope" style={{ color: 'var(--sw-gold)', marginTop: 2 }} />
                <span>info@skywave-insurance.com</span>
              </div>
              <Link to="/contact" className="btn btn-outline btn-sm w-100" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <i className="bi bi-chat-dots" /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}