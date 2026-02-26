import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Staff Login – SkyWave Insurance</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-card__brand">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>
              <i className="bi bi-cloud-lightning-fill" style={{ color: 'var(--sw-gold)' }} />
              SkyWave
            </Link>
            <p>Staff & Admin Portal</p>
          </div>

          <div className="admin-login-card__form">
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome back</h1>
            <p style={{ color: 'var(--sw-text-muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>
              Sign in with your SkyWave staff credentials.
            </p>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                <i className="bi bi-exclamation-triangle-fill" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-envelope" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sw-text-muted)' }} />
                  <input id="email" type="email" className="form-control" required
                    style={{ paddingLeft: '2.6rem' }}
                    placeholder="you@skywave-insurance.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-lock" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sw-text-muted)' }} />
                  <input id="password" type="password" className="form-control" required
                    style={{ paddingLeft: '2.6rem' }}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in…</> : <><i className="bi bi-box-arrow-in-right" /> Sign In</>}
              </button>
            </form>

            <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--sw-text-muted)' }}>
              Not a staff member? <Link to="/" style={{ color: 'var(--sw-gold)' }}>Return to main site</Link>
            </p>
          </div>
        </div>

        <style>{`
          .admin-login-page {
            min-height: 100vh;
            background: linear-gradient(135deg, var(--sw-navy) 0%, var(--sw-navy-light) 100%);
            display: flex; align-items: center; justify-content: center;
            padding: 2rem;
          }
          .admin-login-card {
            width: 100%; max-width: 440px;
            background: #fff; border-radius: var(--radius-xl);
            overflow: hidden; box-shadow: var(--shadow-lg);
          }
          .admin-login-card__brand {
            background: var(--sw-navy);
            padding: 2rem;
            border-bottom: 3px solid var(--sw-gold);
          }
          .admin-login-card__brand p {
            color: rgba(255,255,255,0.5);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 0.25rem;
          }
          .admin-login-card__form { padding: 2.5rem; }
        `}</style>
      </div>
    </>
  );
}