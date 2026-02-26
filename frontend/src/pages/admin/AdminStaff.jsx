import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { staffService } from '../../services/api';

const emptyForm = { email: '', first_name: '', last_name: '', role: 'staff', department: '', phone: '', password: '', password_confirm: '' };

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    staffService.list().then(({ data }) => setStaff(data.results || data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setSaving(true);
    try {
      await staffService.create(form);
      setMsg({ type: 'success', text: 'Staff user created successfully.' });
      setForm(emptyForm);
      load();
      setShowForm(false);
    } catch (err) {
      const errData = err.response?.data;
      const detail = errData?.email?.[0] || errData?.detail || 'Failed to create user.';
      setMsg({ type: 'error', text: detail });
    }
    setSaving(false);
  };

  const handleToggleActive = async (id, is_active) => {
    try { await staffService.update(id, { is_active: !is_active }); load(); } catch {}
  };

  const ROLE_COLORS = { admin: 'badge-danger', manager: 'badge-warning', staff: 'badge-navy' };

  return (
    <>
      <Helmet><title>Staff Users – SkyWave Admin</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Staff Users</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setMsg(null); }}>
          <i className="bi bi-person-plus" /> Add Staff User
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem' }}>Create Staff Account</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sw-text-muted)' }}>
              <i className="bi bi-x-lg" />
            </button>
          </div>
          {msg && <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}><i className={`bi ${msg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'}`} /><span>{msg.text}</span></div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {[
              { name: 'first_name', label: 'First Name *', type: 'text', req: true },
              { name: 'last_name', label: 'Last Name *', type: 'text', req: true },
              { name: 'email', label: 'Email Address *', type: 'email', req: true },
              { name: 'phone', label: 'Phone', type: 'text' },
              { name: 'department', label: 'Department', type: 'text' },
            ].map(f => (
              <div key={f.name} className="form-group">
                <label className="form-label">{f.label}</label>
                <input name={f.name} type={f.type} className="form-control" required={f.req} value={form[f.name]} onChange={handleChange} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange}>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input name="password" type="password" className="form-control" required minLength={8} value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input name="password_confirm" type="password" className="form-control" required value={form.password_confirm} onChange={handleChange} />
            </div>
            <div className="alert alert-info" style={{ gridColumn: '1/-1', fontSize: '0.82rem' }}>
              <i className="bi bi-info-circle" />
              <span><strong>Role permissions:</strong> Staff — view only. Manager — staff + jobs & applications. Admin — full access.</span>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating…</> : <><i className="bi bi-person-check" /> Create Account</>}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner" /></div>
        : staff.length === 0
          ? <div className="card text-center" style={{ padding: '3rem' }}><p className="text-muted">No staff users found.</p></div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {staff.map((u) => (
                <div key={u.id} className="card" style={{ padding: '1.1rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'var(--sw-navy)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                      }}>
                        {u.first_name?.[0]}{u.last_name?.[0]}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <strong style={{ fontSize: '0.92rem' }}>{u.full_name}</strong>
                          <span className={`badge ${ROLE_COLORS[u.role] || 'badge-navy'}`}>{u.role}</span>
                          {!u.is_active && <span className="badge badge-warning">Inactive</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--sw-text-muted)' }}>
                          <span><i className="bi bi-envelope" /> {u.email}</span>
                          {u.department && <span><i className="bi bi-building" /> {u.department}</span>}
                          <span><i className="bi bi-calendar3" /> Joined {new Date(u.date_joined).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleToggleActive(u.id, u.is_active)}
                      style={{
                        background: u.is_active ? 'rgba(224,64,64,0.1)' : 'rgba(29,184,124,0.1)',
                        color: u.is_active ? 'var(--sw-danger)' : 'var(--sw-success)',
                        border: `1px solid ${u.is_active ? 'rgba(224,64,64,0.2)' : 'rgba(29,184,124,0.2)'}`,
                      }}
                    >
                      <i className={`bi ${u.is_active ? 'bi-person-x' : 'bi-person-check'}`} />
                      {u.is_active ? ' Deactivate' : ' Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </>
  );
}