import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { contactService } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  const load = () => {
    setLoading(true);
    contactService.list()
      .then(({ data }) => setMessages(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await contactService.markRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
        setSelected(prev => prev?.id === msg.id ? { ...prev, is_read: true } : prev);
      } catch {}
    }
  };

  const displayed = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <>
      <Helmet><title>Contact Messages – SkyWave Admin</title></Helmet>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem' }}>Contact Messages</h1>
              {unreadCount > 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--sw-danger)', fontWeight: 600 }}>
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
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
            : displayed.length === 0
              ? <div className="card text-center" style={{ padding: '3rem' }}><p className="text-muted">No messages found.</p></div>
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {displayed.map((msg) => (
                    <div key={msg.id} className="card"
                      style={{
                        padding: '1.1rem 1.5rem', cursor: 'pointer',
                        border: selected?.id === msg.id ? '1.5px solid var(--sw-gold)' : '1px solid var(--sw-border)',
                        background: !msg.is_read ? 'rgba(74,143,193,0.04)' : '#fff',
                      }}
                      onClick={() => handleSelect(msg)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            {!msg.is_read && <span style={{ width: 8, height: 8, background: 'var(--sw-sky)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />}
                            <strong style={{ fontSize: '0.9rem' }}>{msg.full_name}</strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--sw-text-muted)' }}>· {msg.email}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', fontWeight: !msg.is_read ? 600 : 400, marginBottom: '0.2rem' }}>{msg.subject}</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--sw-text-muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 400 }}>{msg.message}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--sw-text-muted)', flexShrink: 0 }}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '2rem', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem' }}>Message Detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sw-text-muted)', fontSize: '1rem' }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div style={{ background: 'var(--sw-off-white)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <i className="bi bi-person" style={{ color: 'var(--sw-gold)' }} />
                <strong>{selected.full_name}</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <i className="bi bi-envelope" style={{ color: 'var(--sw-gold)' }} />
                <a href={`mailto:${selected.email}`} style={{ color: 'var(--sw-sky)' }}>{selected.email}</a>
              </div>
              {selected.phone && (
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <i className="bi bi-telephone" style={{ color: 'var(--sw-gold)' }} />
                  <span>{selected.phone}</span>
                </div>
              )}
            </div>

            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>{selected.subject}</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--sw-text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.message}</p>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sw-border)' }}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary btn-sm">
                <i className="bi bi-reply" /> Reply by Email
              </a>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--sw-text-muted)' }}>
              Received {new Date(selected.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </>
  );
}