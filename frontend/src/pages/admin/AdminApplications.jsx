import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { applicationsService } from '../../services/api';

const STATUS_COLORS = {
  received: 'badge-navy', reviewing: 'badge-warning',
  interview: 'badge-gold', offered: 'badge-success',
  rejected: 'badge-danger', withdrawn: 'badge-navy',
};

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    applicationsService.list(filter ? { status: filter } : {})
      .then(({ data }) => setApps(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await applicationsService.updateStatus(id, status);
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    } catch {}
  };

  return (
    <>
      <Helmet><title>Job Applications – SkyWave Admin</title></Helmet>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem' }}>Job Applications</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[['', 'All'], ['received', 'Received'], ['reviewing', 'Reviewing'], ['interview', 'Interview'], ['offered', 'Offered'], ['rejected', 'Rejected']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)}
                  style={{
                    padding: '0.3rem 0.85rem', fontSize: '0.78rem', borderRadius: '999px',
                    border: '1.5px solid', cursor: 'pointer', fontWeight: 500, transition: 'var(--transition)',
                    borderColor: filter === val ? 'var(--sw-navy)' : 'var(--sw-border)',
                    background: filter === val ? 'var(--sw-navy)' : '#fff',
                    color: filter === val ? '#fff' : 'var(--sw-text-muted)',
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {loading
            ? <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner" /></div>
            : apps.length === 0
              ? <div className="card text-center" style={{ padding: '3rem' }}><p className="text-muted">No applications found.</p></div>
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {apps.map((app) => (
                    <div key={app.id} className="card"
                      style={{ padding: '1.1rem 1.5rem', cursor: 'pointer', border: selected?.id === app.id ? '1.5px solid var(--sw-gold)' : '1px solid var(--sw-border)' }}
                      onClick={() => setSelected(selected?.id === app.id ? null : app)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                            <strong style={{ fontSize: '0.92rem' }}>{app.full_name}</strong>
                            <span className={`badge ${STATUS_COLORS[app.status] || 'badge-navy'}`}>{app.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--sw-text-muted)' }}>
                            <span><i className="bi bi-briefcase" /> {app.job_title || `Job #${app.job}`}</span>
                            <span><i className="bi bi-envelope" /> {app.email}</span>
                            <span><i className="bi bi-clock" /> {new Date(app.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <i className="bi bi-chevron-right" style={{ color: 'var(--sw-text-muted)', marginTop: 4, flexShrink: 0 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </div>

        {selected && (
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '2rem', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem' }}>Application Detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sw-text-muted)', fontSize: '1rem' }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <span className={`badge ${STATUS_COLORS[selected.status] || 'badge-navy'}`} style={{ marginBottom: '1.5rem', display: 'inline-block' }}>{selected.status}</span>

            {[
              { label: 'Applicant', val: selected.full_name, icon: 'bi-person' },
              { label: 'Email', val: selected.email, icon: 'bi-envelope' },
              { label: 'Phone', val: selected.phone, icon: 'bi-telephone' },
              { label: 'Position', val: selected.job_title || `Job #${selected.job}`, icon: 'bi-briefcase' },
              { label: 'LinkedIn', val: selected.linkedin_url, icon: 'bi-linkedin', isLink: true },
              { label: 'Portfolio', val: selected.portfolio_url, icon: 'bi-globe2', isLink: true },
            ].filter(r => r.val).map((r) => (
              <div key={r.label} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem', alignItems: 'flex-start' }}>
                <i className={`bi ${r.icon}`} style={{ color: 'var(--sw-gold)', marginTop: 2, flexShrink: 0, width: 16 }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--sw-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{r.label}</span>
                  {r.isLink
                    ? <a href={r.val} target="_blank" rel="noreferrer" style={{ color: 'var(--sw-sky)', wordBreak: 'break-all' }}>{r.val}</a>
                    : <span>{r.val}</span>
                  }
                </div>
              </div>
            ))}

            {selected.cover_letter && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sw-border)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--sw-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Cover Letter</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--sw-text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.cover_letter}</p>
              </div>
            )}

            {selected.resume && (
              <div style={{ marginTop: '1rem' }}>
                <a href={selected.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                  <i className="bi bi-file-earmark-pdf" /> Download Resume
                </a>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sw-border)' }}>
              <label className="form-label">Update Status</label>
              <select className="form-control" value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
              >
                {['received', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );
}