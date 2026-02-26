import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { teamService } from '../services/api';

const timeline = [
  { year: '1999', event: 'SkyWave Insurance founded in Lloyd\'s of London market with focus on aviation hull.' },
  { year: '2003', event: 'Expanded marine division to cover luxury yachts and superyachts across the Mediterranean.' },
  { year: '2007', event: 'Launched commercial fleet insurance product; first year writing 200+ fleet policies.' },
  { year: '2012', event: 'Achieved Lloyd\'s Syndicate status, unlocking global underwriting capacity.' },
  { year: '2017', event: 'Opened offices in Singapore and Dubai to serve Asia-Pacific and MENA clients.' },
  { year: '2022', event: 'Surpassed 3,000 active policies; awarded Insurance Provider of the Year.' },
  { year: '2024', event: 'Launched digital self-service portal and 24/7 claims tracking for all policyholders.' },
];

const values = [
  { icon: 'bi-eye', title: 'Transparency', desc: 'Clear policy language, no hidden exclusions, and open communication at every step.' },
  { icon: 'bi-people', title: 'Client Partnership', desc: 'Your assigned underwriter knows your operations and grows with your business.' },
  { icon: 'bi-patch-check', title: 'Technical Excellence', desc: 'Our underwriters hold ACII, AMAE, and CII qualifications across aviation, marine, and motor.' },
  { icon: 'bi-heart', title: 'Integrity', desc: 'We pay valid claims promptly and without dispute. Our reputation is built one claim at a time.' },
];

export default function AboutPage() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    teamService.list().then(({ data }) => setTeam(data.results || data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>About SkyWave Insurance – Our Story, Mission & Team</title>
        <meta name="description" content="Learn about SkyWave Insurance's 25+ year history as specialist underwriters for fleet vehicles, aircraft, and marine assets. Meet our expert team." />
        <meta property="og:title" content="About SkyWave Insurance" />
        <meta property="og:description" content="25+ years of specialist insurance expertise in fleet, aviation, and marine." />
        <link rel="canonical" href="https://www.skywave-insurance.com/about" />
      </Helmet>

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container fade-in-up">
          <span className="section-label">About Us</span>
          <h1 className="display-2 text-white" style={{ marginBottom: '1rem' }}>
            Specialists by Choice.<br />Trusted by Necessity.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 580 }}>
            For over 25 years, SkyWave has focused on the most complex asset classes in the insurance market — and become the benchmark for expertise in each one.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">Our Mission</span>
              <h2 className="heading-xl" style={{ marginBottom: '1.25rem' }}>Protecting the World's Most Complex Assets</h2>
              <p style={{ color: 'var(--sw-text-muted)', marginBottom: '1.25rem', lineHeight: 1.8 }}>
                Commercial fleets keep economies moving. Aircraft connect the world. Yachts represent a lifetime of ambition. These are not ordinary assets — and they deserve extraordinary insurance.
              </p>
              <p style={{ color: 'var(--sw-text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                SkyWave was founded on the belief that specialist knowledge, not volume, produces the best insurance outcomes. We write fewer policies than generalist insurers — and we do it better.
              </p>
              <Link to="/get-quote" className="btn btn-primary">
                <i className="bi bi-file-earmark-check" /> Get a Quote
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {values.map((v) => (
                <div key={v.title} style={{
                  background: 'var(--sw-off-white)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  border: '1px solid var(--sw-border)',
                }}>
                  <i className={`bi ${v.icon}`} style={{ fontSize: '1.5rem', color: 'var(--sw-gold)', display: 'block', marginBottom: '0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{v.title}</h4>
                  <p style={{ fontSize: '0.83rem', color: 'var(--sw-text-muted)', lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: 'var(--sw-navy)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Our Journey</span>
            <h2 className="heading-xl text-white">25 Years of Growth</h2>
          </div>
          <div className="sw-timeline">
            {timeline.map((t, i) => (
              <div key={t.year} className={`sw-timeline__item${i % 2 === 0 ? '' : ' sw-timeline__item--right'}`}>
                <div className="sw-timeline__content">
                  <span className="sw-timeline__year">{t.year}</span>
                  <p>{t.event}</p>
                </div>
                <div className="sw-timeline__dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>The People</span>
              <h2 className="heading-xl">Meet Our Leadership</h2>
            </div>
            <div className="grid-4">
              {team.map((member) => (
                <div key={member.id} className="sw-team-card">
                  <div className="sw-team-card__photo">
                    {member.photo
                      ? <img src={member.photo} alt={member.name} />
                      : <span>{member.name?.[0]}</span>
                    }
                  </div>
                  <div style={{ padding: '1.25rem 1rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{member.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--sw-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{member.role}</p>
                    {member.bio && <p style={{ fontSize: '0.83rem', color: 'var(--sw-text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>{member.bio}</p>}
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noreferrer" style={{ color: 'var(--sw-sky)', marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}>
                        <i className="bi bi-linkedin" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ background: 'var(--sw-off-white)' }}>
        <div className="container text-center">
          <h2 className="heading-xl" style={{ marginBottom: '1rem' }}>Join the SkyWave Family</h2>
          <p style={{ color: 'var(--sw-text-muted)', maxWidth: 500, margin: '0 auto 2rem' }}>
            Whether you're looking for better coverage or an exciting career in specialist insurance, we'd love to hear from you.
          </p>
          <div className="flex-center gap-3 flex-wrap">
            <Link to="/get-quote" className="btn btn-primary">Get a Quote</Link>
            <Link to="/careers" className="btn btn-navy">View Careers</Link>
          </div>
        </div>
      </section>

      <style>{`
        .sw-timeline { position: relative; max-width: 700px; margin: 0 auto; }
        .sw-timeline::before {
          content: '';
          position: absolute; left: 50%; top: 0; bottom: 0;
          width: 2px; background: rgba(201,168,76,0.3);
          transform: translateX(-50%);
        }
        .sw-timeline__item {
          display: flex; justify-content: flex-end;
          padding-right: calc(50% + 2rem);
          margin-bottom: 2.5rem; position: relative;
        }
        .sw-timeline__item--right {
          justify-content: flex-start;
          padding-right: 0; padding-left: calc(50% + 2rem);
        }
        .sw-timeline__content {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
          max-width: 320px;
        }
        .sw-timeline__content p { color: rgba(255,255,255,0.7); font-size: 0.88rem; line-height: 1.6; }
        .sw-timeline__year {
          display: block;
          font-family: var(--font-display);
          font-size: 1.4rem; font-weight: 700;
          color: var(--sw-gold); margin-bottom: 0.4rem;
        }
        .sw-timeline__dot {
          position: absolute; left: 50%; top: 1.25rem;
          width: 14px; height: 14px;
          background: var(--sw-gold); border-radius: 50%;
          transform: translateX(-50%);
          border: 3px solid var(--sw-navy);
        }
        .sw-team-card {
          background: #fff; border: 1px solid var(--sw-border);
          border-radius: var(--radius-lg); overflow: hidden;
          transition: var(--transition);
        }
        .sw-team-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .sw-team-card__photo {
          height: 180px; background: var(--sw-navy-mid);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .sw-team-card__photo img { width: 100%; height: 100%; object-fit: cover; }
        .sw-team-card__photo span { font-size: 3rem; font-weight: 700; color: var(--sw-gold); font-family: var(--font-display); }
        @media (max-width: 768px) {
          .sw-timeline__item, .sw-timeline__item--right { padding: 0 0 0 2rem; justify-content: flex-start; }
          .sw-timeline::before { left: 0; }
          .sw-timeline__dot { left: 0; }
        }
      `}</style>
    </>
  );
}