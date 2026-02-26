import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { jobsService } from '../services/api';

const perks = [
  { icon: 'bi-heart-pulse', title: 'Health & Wellness', desc: 'Full medical, dental, and vision coverage for you and your family, plus a $1,500 annual wellness stipend.' },
  { icon: 'bi-mortarboard', title: 'Learning & Development', desc: 'CII study support, external courses, and conference budget to keep you at the top of your field.' },
  { icon: 'bi-globe2', title: 'Remote Flexibility', desc: 'Hybrid model with core collaboration days. Work from our offices or from anywhere in your time zone.' },
  { icon: 'bi-piggy-bank', title: 'Competitive Package', desc: 'Market-leading salary, performance bonus, and generous pension/401k matching.' },
];

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    jobsService.list().then(({ data }) => {
      setJobs(data.results || data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const departments = [...new Set(jobs.map((j) => j.department))];
  const displayed = filter === 'all' ? jobs : jobs.filter((j) => j.department === filter);

  return (
    <>
      <Helmet>
        <title>Careers at SkyWave Insurance – Join Our Team</title>
        <meta name="description" content="Explore career opportunities at SkyWave Insurance. We're hiring underwriters, claims specialists, and more. Join a team that values expertise and innovation." />
        <meta property="og:title" content="Careers – SkyWave Insurance" />
        <link rel="canonical" href="https://www.skywave-insurance.com/careers" />
      </Helmet>

      <div className="page-hero">
        <div className="container fade-in-up">
          <span className="section-label">Join the Team</span>
          <h1 className="display-2 text-white">Build Your Career<br />with the Best</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540, marginTop: '1rem' }}>
            SkyWave is a team of specialists who are passionate about what we do. We're growing — and we'd love talented, curious people to grow with us.
          </p>
        </div>
      </div>

      {/* Perks */}
      <section className="section" style={{ background: 'var(--sw-off-white)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Why SkyWave</span>
            <h2 className="heading-xl">Life at SkyWave</h2>
          </div>
          <div className="grid-4">
            {perks.map((p) => (
              <div key={p.title} className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <i className={`bi ${p.icon}`} style={{ fontSize: '2rem', color: 'var(--sw-gold)', display: 'block', marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{p.title}</h4>
                <p style={{ fontSize: '0.83rem', color: 'var(--sw-text-muted)', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job listings */}
      <section className="section">
        <div className="container">
          <div className="flex-between flex-wrap gap-3" style={{ marginBottom: '2.5rem' }}>
            <div>
              <span className="section-label">Open Roles</span>
              <h2 className="heading-xl">Current Opportunities</h2>
            </div>
            {departments.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className={`sw-dept-filter${filter === 'all' ? ' active' : ''}`}
                  onClick={() => setFilter('all')}
                >All</button>
                {departments.map((d) => (
                  <button key={d}
                    className={`sw-dept-filter${filter === d ? ' active' : ''}`}
                    onClick={() => setFilter(d)}
                  >{d}</button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner" /></div>
          ) : displayed.length === 0 ? (
            <div className="card text-center" style={{ padding: '4rem' }}>
              <i className="bi bi-briefcase" style={{ fontSize: '3rem', color: 'var(--sw-border)', display: 'block', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Open Positions</h3>
              <p className="text-muted">We don't have any open roles right now, but we'd love to hear from you. Send your CV to <a href="mailto:careers@skywave-insurance.com" style={{ color: 'var(--sw-gold)' }}>careers@skywave-insurance.com</a>.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayed.map((job) => (
                <div key={job.id} className="sw-job-card">
                  <div className="sw-job-card__info">
                    <span className="badge badge-navy">{job.department}</span>
                    <h3>{job.title}</h3>
                    <div className="sw-job-card__meta">
                      <span><i className="bi bi-geo-alt" /> {job.location}</span>
                      <span><i className="bi bi-briefcase" /> {job.job_type_display}</span>
                      {job.salary_range && <span><i className="bi bi-currency-dollar" /> {job.salary_range}</span>}
                      {job.deadline && <span><i className="bi bi-calendar3" /> Apply by {job.deadline}</span>}
                    </div>
                  </div>
                  <div className="sw-job-card__actions">
                    {!job.is_open && <span className="badge badge-warning">Closed</span>}
                    <Link to={`/careers/${job.id}`} className="btn btn-primary btn-sm">
                      View & Apply <i className="bi bi-arrow-right" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .sw-dept-filter {
          padding: 0.4rem 1rem;
          border: 1.5px solid var(--sw-border);
          border-radius: 999px;
          background: #fff;
          font-size: 0.82rem; font-weight: 500;
          color: var(--sw-text-muted);
          cursor: pointer; transition: var(--transition);
        }
        .sw-dept-filter:hover, .sw-dept-filter.active {
          border-color: var(--sw-navy);
          background: var(--sw-navy); color: #fff;
        }
        .sw-job-card {
          background: #fff;
          border: 1px solid var(--sw-border);
          border-radius: var(--radius-md);
          padding: 1.5rem 2rem;
          display: flex; align-items: center; justify-content: space-between; gap: 2rem;
          transition: var(--transition);
        }
        .sw-job-card:hover { border-color: var(--sw-gold); box-shadow: var(--shadow-sm); }
        .sw-job-card__info { flex: 1; }
        .sw-job-card__info h3 { font-size: 1.15rem; margin: 0.4rem 0; }
        .sw-job-card__meta { display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; margin-top: 0.4rem; }
        .sw-job-card__meta span { font-size: 0.82rem; color: var(--sw-text-muted); display: flex; align-items: center; gap: 0.35rem; }
        .sw-job-card__meta i { color: var(--sw-gold); }
        .sw-job-card__actions { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        @media (max-width: 640px) {
          .sw-job-card { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </>
  );
}