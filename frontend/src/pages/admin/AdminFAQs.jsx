import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faqService } from '../../services/api';

const CATEGORIES = ['general', 'fleet', 'aircraft', 'yacht', 'claims', 'billing'];
const emptyForm = { category: 'general', question: '', answer: '', order: 0, is_active: true };

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [catFilter, setCatFilter] = useState('');

  const load = () => {
    setLoading(true);
    faqService.list(catFilter ? { category: catFilter } : {})
      .then(({ data }) => setFaqs(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, [catFilter]);

  const openCreate = () => { setForm(emptyForm); setEditItem(null); setShowForm(true); setMsg(null); };
  const openEdit = (item) => { setForm({ ...item }); setEditItem(item); setShowForm(true); setMsg(null); };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await faqService.update(editItem.id, form);
      } else {
        await faqService.create(form);
      }
      setMsg({ type: 'success', text: `FAQ ${editItem ? 'updated' : 'created'} successfully.` });
      load();
      if (!editItem) { setForm(emptyForm); }
    } catch {
      setMsg({ type: 'error', text: 'Save failed. Please try again.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    try { await faqService.delete(id); load(); } catch {}
  };

  return (
    <>
      <Helmet><title>Manage FAQs – SkyWave Admin</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Manage FAQs</h1>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <i className="bi bi-plus-lg" /> New FAQ
        </button>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[['', 'All'], ...CATEGORIES.map(c => [c, c.charAt(0).toUpperCase() + c.slice(1)])].map(([val, label]) => (
          <button key={val} onClick={() => setCatFilter(val)}
            style={{
              padding: '0.3rem 0.85rem', fontSize: '0.78rem', borderRadius: '999px',
              border: '1.5px solid', cursor: 'pointer', fontWeight: 500,
              borderColor: catFilter === val ? 'var(--sw-navy)' : 'var(--sw-border)',
              background: catFilter === val ? 'var(--sw-navy)' : '#fff',
              color: catFilter === val ? '#fff' : 'var(--sw-text-muted)',
            }}
          >{label}</button>
        ))}
      </div>

      {showForm && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem' }}>{editItem ? 'Edit FAQ' : 'New FAQ'}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sw-text-muted)' }}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {msg && <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}><i className={`bi ${msg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'}`} /><span>{msg.text}</span></div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input name="order" type="number" min="0" className="form-control" value={form.order} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Question *</label>
              <input name="question" className="form-control" required value={form.question} onChange={handleChange} placeholder="What does fleet insurance cover?" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Answer *</label>
              <textarea name="answer" className="form-control" required rows={5} value={form.answer} onChange={handleChange} placeholder="Fleet insurance covers..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="faq_active" name="is_active" checked={form.is_active} onChange={handleChange} style={{ width: 16, height: 16 }} />
              <label htmlFor="faq_active" style={{ fontSize: '0.88rem', fontWeight: 500 }}>Active (visible on public site)</label>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</> : <><i className="bi bi-check-lg" /> {editItem ? 'Update' : 'Create'} FAQ</>}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner" /></div>
        : faqs.length === 0
          ? <div className="card text-center" style={{ padding: '3rem' }}><p className="text-muted">No FAQs found.</p></div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {faqs.map((faq) => (
                <div key={faq.id} className="card" style={{ padding: '1.1rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span className="badge badge-navy">{faq.category_display || faq.category}</span>
                        {!faq.is_active && <span className="badge badge-warning">Inactive</span>}
                      </div>
                      <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' }}>{faq.question}</strong>
                      <p style={{ fontSize: '0.82rem', color: 'var(--sw-text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{faq.answer}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(faq)}>
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn btn-sm" onClick={() => handleDelete(faq.id)}
                        style={{ background: 'rgba(224,64,64,0.1)', color: 'var(--sw-danger)', border: '1px solid rgba(224,64,64,0.2)' }}>
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </>
  );
}