import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { faqService } from '../services/api';

const CATEGORIES = [
  { value: 'all', label: 'All FAQs', icon: 'bi-list-ul' },
  { value: 'general', label: 'General', icon: 'bi-info-circle' },
  { value: 'fleet', label: 'Fleet', icon: 'bi-truck' },
  { value: 'aircraft', label: 'Aircraft', icon: 'bi-airplane' },
  { value: 'yacht', label: 'Yacht', icon: 'bi-water' },
  { value: 'claims', label: 'Claims', icon: 'bi-clipboard2-pulse' },
  { value: 'billing', label: 'Billing', icon: 'bi-receipt' },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`sw-faq-item${isOpen ? ' open' : ''}`} onClick={onToggle}>
      <div className="sw-faq-item__q">
        <span>{item.question}</span>
        <i className={`bi ${isOpen ? 'bi-dash-circle' : 'bi-plus-circle'}`} />
      </div>
      {isOpen && (
        <div className="sw-faq-item__a">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    faqService.list().then(({ data }) => setFaqs(data.results || data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const displayed = faqs
    .filter((f) => category === 'all' || f.category === category)
    .filter((f) =>
      !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions – SkyWave Insurance</title>
        <meta name="description" content="Answers to common questions about SkyWave fleet, aircraft, and yacht insurance — coverage, claims, billing, and more." />
        <meta property="og:title" content="FAQs – SkyWave Insurance" />
        <link rel="canonical" href="https://www.skywave-insurance.com/faqs" />
      </Helmet>

      <div className="page-hero">
        <div className="container fade-in-up">
          <span className="section-label">FAQs</span>
          <h1 className="display-2 text-white">Frequently Asked<br />Questions</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, marginTop: '1rem' }}>
            Can't find your answer? Contact us directly — no account needed.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '6rem' }}>
            {/* Search */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sw-text-muted)' }} />
                <input
                  className="form-control"
                  placeholder="Search FAQs…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.value}
                  className={`sw-faq-nav-btn${category === cat.value ? ' active' : ''}`}
                  onClick={() => setCategory(cat.value)}
                >
                  <i className={`bi ${cat.icon}`} /> {cat.label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--sw-navy)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Didn't find what you're looking for?
              </p>
              <Link to="/contact" className="btn btn-primary btn-sm w-100" style={{ justifyContent: 'center' }}>
                <i className="bi bi-chat-dots" /> Contact Us
              </Link>
            </div>
          </div>

          {/* FAQ List */}
          <div>
            {loading ? (
              <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner" /></div>
            ) : displayed.length === 0 ? (
              <div className="card text-center" style={{ padding: '3rem' }}>
                <i className="bi bi-question-circle" style={{ fontSize: '3rem', color: 'var(--sw-border)', display: 'block', marginBottom: '1rem' }} />
                <p className="text-muted">No matching FAQs found.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {displayed.map((faq) => (
                  <AccordionItem
                    key={faq.id} item={faq}
                    isOpen={openId === faq.id}
                    onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .sw-faq-nav-btn {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.6rem 0.85rem;
          border: none; background: transparent;
          border-radius: var(--radius-sm);
          font-size: 0.87rem; font-weight: 500;
          color: var(--sw-text-muted);
          cursor: pointer; text-align: left;
          transition: var(--transition);
        }
        .sw-faq-nav-btn:hover { color: var(--sw-text); background: var(--sw-off-white); }
        .sw-faq-nav-btn.active { color: var(--sw-navy); background: var(--sw-gold-pale); font-weight: 600; }
        .sw-faq-nav-btn i { flex-shrink: 0; }

        .sw-faq-item {
          background: #fff;
          border: 1px solid var(--sw-border);
          border-radius: var(--radius-md);
          cursor: pointer; transition: var(--transition);
          overflow: hidden;
        }
        .sw-faq-item.open { border-color: var(--sw-gold); }
        .sw-faq-item__q {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1.25rem 1.5rem;
          font-weight: 600; font-size: 0.95rem;
          user-select: none;
        }
        .sw-faq-item.open .sw-faq-item__q { color: var(--sw-navy); }
        .sw-faq-item__q i { color: var(--sw-gold); flex-shrink: 0; font-size: 1.1rem; }
        .sw-faq-item__a { padding: 0 1.5rem 1.25rem; }
        .sw-faq-item__a p { color: var(--sw-text-muted); font-size: 0.9rem; line-height: 1.7; }

        @media (max-width: 768px) {
          .faq-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}