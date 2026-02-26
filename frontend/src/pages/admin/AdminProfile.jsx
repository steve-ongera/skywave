import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

export default function AdminProfile() {
  const { user } = useAuth();
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateMe(profileForm);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
    }
    setSaving(false);
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSavingPw(true);
    try {
      await authService.changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password });
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setPwForm({ old_password: '', new_password: '', confirm: '' });
    } catch (err) {
      const msg = err.response?.data?.old_password?.[0] || 'Failed to change password.';
      setPwMsg({ type: 'error', text: msg });
    }
    setSavingPw(false);
  };

  return (
    <>
      <Helmet><title>My Profile – SkyWave Admin</title></Helmet>

      <div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>My Profile</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Profile info */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--sw-navy)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem',
              }}>
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{user?.full_name}</h3>
                <span className="badge badge-gold">{user?.role}</span>
              </div>
            </div>

            {profileMsg && (
              <div className={`alert ${profileMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
                <i className={`bi ${profileMsg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'}`} />
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input name="first_name" className="form-control" value={profileForm.first_name} onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input name="last_name" className="form-control" value={profileForm.last_name} onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Email</label>
                <input className="form-control" value={user?.email || ''} disabled style={{ background: 'var(--sw-off-white)', color: 'var(--sw-text-muted)' }} />
                <small style={{ fontSize: '0.75rem', color: 'var(--sw-text-muted)' }}>Contact an admin to change your email address.</small>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input name="department" className="form-control" value={profileForm.department} onChange={e => setProfileForm({ ...profileForm, department: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</> : <><i className="bi bi-check-lg" /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>

          {/* Change password */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>
              <i className="bi bi-lock" style={{ color: 'var(--sw-gold)', marginRight: '0.5rem' }} />
              Change Password
            </h2>

            {pwMsg && (
              <div className={`alert ${pwMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
                <i className={`bi ${pwMsg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'}`} />
                <span>{pwMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePwSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" required value={pwForm.old_password} onChange={e => setPwForm({ ...pwForm, old_password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password (min. 8 characters)</label>
                <input type="password" className="form-control" required minLength={8} value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" required value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
              </div>
              <div>
                <button type="submit" className="btn btn-navy" disabled={savingPw}>
                  {savingPw ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Updating…</> : <><i className="bi bi-lock" /> Update Password</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}