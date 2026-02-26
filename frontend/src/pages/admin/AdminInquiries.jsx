import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { inquiryService } from '../../services/api';

const STATUS_COLORS = { new: 'badge-danger', in_review: 'badge-warning', quoted: 'badge-success', closed: 'badge-navy' };

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    inquiryService.list(filter ? { status: filter } : {})
      .then(({ data }) => setInquiries(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await inquiryService.update(id, { status });
      setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch {}
    setUpdating(false);
  };

  return (
    <>
      <Helmet><title>Inquiries – SkyWave Admin</title></Helmet>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem' }}>Insurance Inquiries</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[['', 'All'], ['new', 'New'], ['in_review', 'In Review'], ['quoted', 'Quoted'], ['closed', 'Closed']].map(([val, label]) => (
                <button key={val}
                  onClick={() => setFilter(val)}
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
            : inquiries.length === 0
              ? <div className="card text-center" style={{ padding: '3rem' }}><p className="text-muted">No inquiries found.</p></div>
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="card"
                      style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', border: selected?.id === inq.id ? '1.5px solid var(--sw-gold)' : '1px solid var(--sw-border)' }}
                      onClick={() => setSelected(selected?.id === inq.id ? null : inq)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                            <strong style={{ fontSize: '0.95rem' }}>{inq.full_name}</strong>
                            <span className={`badge ${STATUS_COLORS[inq.status] || 'badge-navy'}`}>{inq.status?.replace('_', ' ')}</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', fontSize: '0.8rem', color: 'var(--sw-text-muted)' }}>
                            <span><i className="bi bi-envelope" /> {inq.email}</span>
                            <span><i className="bi bi-tag" /> {inq.service_category_display || inq.service_category}</span>
                            <span><i className="bi bi-clock" /> {new Date(inq.created_at).toLocaleDateString()}</span>
                            {inq.company_name && <span><i className="bi bi-building" /> {inq.company_name}</span>}
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

        {/* Detail Panel */}
        {selected && (
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '2rem', maxHeight: '88vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem' }}>Inquiry #{selected.id}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sw-text-muted)', fontSize: '1rem' }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {/* Status badge */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span className={`badge ${STATUS_COLORS[selected.status] || 'badge-navy'}`} style={{ fontSize: '0.8rem' }}>
                {selected.status?.replace('_', ' ')}
              </span>
            </div>

            {/* Fields */}
            {[
              { label: 'Full Name', val: selected.full_name, icon: 'bi-person' },
              { label: 'Email', val: selected.email, icon: 'bi-envelope' },
              { label: 'Phone', val: selected.phone, icon: 'bi-telephone' },
              { label: 'Company', val: selected.company_name, icon: 'bi-building' },
              { label: 'Category', val: selected.service_category_display || selected.service_category, icon: 'bi-tag' },
              { label: 'Fleet Size', val: selected.fleet_size, icon: 'bi-truck' },
              { label: 'Vehicle Types', val: selected.vehicle_types, icon: 'bi-car-front' },
              { label: 'Aircraft Type', val: selected.aircraft_type, icon: 'bi-airplane' },
              { label: 'Aircraft Reg.', val: selected.aircraft_registration, icon: 'bi-hash' },
              { label: 'Flight Hours/Yr', val: selected.flight_hours_per_year, icon: 'bi-clock' },
              { label: 'Yacht Type', val: selected.yacht_type, icon: 'bi-water' },
              { label: 'Yacht Length (m)', val: selected.yacht_length_meters, icon: 'bi-rulers' },
              { label: 'Cruising Area', val: selected.cruising_area, icon: 'bi-globe2' },
              { label: 'Coverage Amount', val: selected.coverage_amount ? `$${Number(selected.coverage_amount).toLocaleString()}` : null, icon: 'bi-currency-dollar' },
              { label: 'Message', val: selected.message, icon: 'bi-chat-left-text' },
            ].filter(r => r.val).map((r) => (
              <div key={r.label} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem', fontSize: '0.85rem', alignItems: 'flex-start' }}>
                <i className={`bi ${r.icon}`} style={{ color: 'var(--sw-gold)', marginTop: 2, flexShrink: 0, width: 16 }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--sw-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{r.label}</span>
                  <span style={{ wordBreak: 'break-word' }}>{r.val}</span>
                </div>
              </div>
            ))}

            {/* Update status */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sw-border)' }}>
              <label className="form-label">Update Status</label>
              <select className="form-control" value={selected.status} disabled={updating}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
              >
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
              {updating && <p style={{ fontSize: '0.78rem', color: 'var(--sw-text-muted)', marginTop: '0.4rem' }}>Updating…</p>}
            </div>

            {/* Submitted date */}
            <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--sw-text-muted)' }}>
              Submitted {new Date(selected.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </>
  );
}