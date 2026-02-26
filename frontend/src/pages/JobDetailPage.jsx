import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { jobsService, applicationsService } from '../services/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', cover_letter: '', linkedin_url: '', portfolio_url: '', resume: null });
  const [appStatus, setAppStatus] = useState(null);

  useEffect(() => {
    jobsService.get(id).then(({ data }) => setJob(data)).catch(() => setJob(null)).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setForm({ ...form, resume: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAppStatus('sending');
    try {
      const fd = new FormData();
      fd.append('job', id);
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      await applicationsService.submit(fd);
      setAppStatus('success');
    } catch {
      setAppStatus('error');
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}><div className="spinner" /></div>;
  if (!job) return (
    <div className="section text-center container">
      <h2>Position not found</h2>
      <Link to="/careers" className="btn btn-navy" style={{ marginTop: '1rem' }}>Back to Careers</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{job.title} – Careers at SkyWave Insurance</title>
        <meta name="description" content={`${job.title} at SkyWave Insurance – ${job.location}. ${job.description?.slice(0, 140)}`} />
        <link rel="canonical" href={`https://www.skywave-insurance.com/careers/${id}`} />
      </Helmet>

      <div className="page-hero">
        <div className="container fade-in-up">
          <Link to="/careers" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
            <i className="bi bi-chevron-left" /> Back to Careers
          </Link>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>{job.department}</span>
          <h1 className="display-2 text-white">{job.title}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {[
              { icon: 'bi-geo-alt', val: job.location },
              { icon: 'bi-briefcase', val: job.job_type_display },
              { icon: 'bi-currency-dollar', val: job.salary_range },
            ].filter(x => x.val).map((m) => (
              <span key={m.icon} style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <i className={`bi ${m.icon}`} style={{ color: 'var(--sw-gold)' }} /> {m.val}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            {/* Description */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>About the Role</h2>
              <p style={{ color: 'var(--sw-text-muted)', lineHeight: 1.8 }}>{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Key Responsibilities</h2>
                <ul style={{ paddingLeft: '1.25rem' }}>
                  {job.responsibilities.map((r, i) => (
                    <li key={i} style={{ color: 'var(--sw-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Requirements</h2>
                <ul style={{ list: 'none', padding: 0 }}>
                  {job.requirements.map((r, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', color: 'var(--sw-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <i className="bi bi-check2-circle" style={{ color: 'var(--sw-success)', marginTop: 3, flexShrink: 0 }} /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nice to have */}
            {job.nice_to_have?.length > 0 && (
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Nice to Have</h2>
                <ul style={{ list: 'none', padding: 0 }}>
                  {job.nice_to_have.map((r, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', color: 'var(--sw-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <i className="bi bi-plus-circle" style={{ color: 'var(--sw-sky)', marginTop: 3, flexShrink: 0 }} /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Job Summary</h3>
              {[
                { icon: 'bi-building', label: 'Department', val: job.department },
                { icon: 'bi-geo-alt', label: 'Location', val: job.location },
                { icon: 'bi-briefcase', label: 'Type', val: job.job_type_display },
                { icon: 'bi-currency-dollar', label: 'Salary', val: job.salary_range || 'Competitive' },
                { icon: 'bi-calendar3', label: 'Deadline', val: job.deadline || 'Open' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <i className={`bi ${item.icon}`} style={{ color: 'var(--sw-gold)', width: 16, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <span style={{ color: 'var(--sw-text-muted)' }}>{item.label}: </span>
                    <strong>{item.val}</strong>
                  </div>
                </div>
              ))}
            </div>

            {job.is_open ? (
              <button className="btn btn-primary w-100" style={{ justifyContent: 'center' }} onClick={() => setShowForm(!showForm)}>
                <i className="bi bi-send" /> Apply for this Role
              </button>
            ) : (
              <div className="alert alert-info">
                <i className="bi bi-info-circle" />
                <span>This position is no longer accepting applications.</span>
              </div>
            )}

            <Link to="/contact" className="btn btn-outline w-100" style={{ justifyContent: 'center' }}>
              <i className="bi bi-chat-dots" /> Ask a Question
            </Link>
          </div>
        </div>

        {/* Application form */}
        {showForm && (
          <div className="container" style={{ marginTop: '3rem' }}>
            <div className="card" style={{ padding: '2.5rem', maxWidth: 700 }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Apply for {job.title}</h2>
              <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '2rem' }}>No account needed. Fill in the form below and upload your CV.</p>

              {appStatus === 'success' ? (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle-fill" />
                  <div><strong>Application submitted!</strong> We'll review your CV and be in touch within 7 days.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {appStatus === 'error' && (
                    <div className="alert alert-error" style={{ gridColumn: '1/-1' }}>
                      <i className="bi bi-exclamation-triangle-fill" />
                      <span>Submission failed. Please try again.</span>
                    </div>
                  )}
                  {[
                    { name: 'full_name', label: 'Full Name *', type: 'text', req: true, placeholder: 'Jane Smith' },
                    { name: 'email', label: 'Email Address *', type: 'email', req: true, placeholder: 'jane@example.com' },
                    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 000-0000' },
                    { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
                  ].map((f) => (
                    <div key={f.name} className="form-group">
                      <label className="form-label" htmlFor={f.name}>{f.label}</label>
                      <input id={f.name} name={f.name} type={f.type} className="form-control"
                        required={f.req} placeholder={f.placeholder}
                        value={form[f.name]} onChange={handleChange} />
                    </div>
                  ))}
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label" htmlFor="cover_letter">Cover Letter *</label>
                    <textarea id="cover_letter" name="cover_letter" className="form-control" required rows={5}
                      placeholder="Tell us why you're a great fit for this role..."
                      value={form.cover_letter} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label" htmlFor="resume">Resume / CV * (PDF or Word, max 5 MB)</label>
                    <input id="resume" name="resume" type="file" className="form-control" required accept=".pdf,.doc,.docx" onChange={handleChange} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <button type="submit" className="btn btn-primary" disabled={appStatus === 'sending'}>
                      {appStatus === 'sending' ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting…</> : <><i className="bi bi-send" /> Submit Application</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}