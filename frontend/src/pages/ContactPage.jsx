import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { contactService } from '../services/api';

const contactInfo = [
  { icon: 'bi-telephone', title: 'Phone', lines: ['+1 (800) SKY-WAVE', '+1 (415) 555-0180'] },
  { icon: 'bi-envelope', title: 'Email', lines: ['info@skywave-insurance.com', 'claims@skywave-insurance.com'] },
  { icon: 'bi-geo-alt', title: 'Head Office', lines: ['1 Maritime Plaza, Suite 900', 'San Francisco, CA 94111'] },
  { icon: 'bi-clock', title: 'Business Hours', lines: ['Monday – Friday: 8 am – 6 pm PST', 'Emergency claims: 24/7'] },
];

export default function ContactPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactService.submit(form);
      setStatus('success');
      setForm({ full_name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact SkyWave Insurance – Reach Our Specialists</title>
        <meta name="description" content="Contact SkyWave Insurance to speak with a fleet, aircraft, or yacht insurance specialist. No account required to send us a message." />
        <meta property="og:title" content="Contact SkyWave Insurance" />
        <link rel="canonical" href="https://www.skywave-insurance.com/contact" />
      </Helmet>

      <div className="page-hero">
        <div className="container fade-in-up">
          <span className="section-label">Get in Touch</span>
          <h1 className="display-2 text-white">We're Here to Help</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, marginTop: '1rem' }}>
            Speak with a specialist, ask a question, or start the conversation about your insurance needs — no account required.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '4rem', alignItems: 'start' }}>

            {/* Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>Send Us a Message</h2>
              <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '2rem' }}>
                Fill in the form below and a member of our team will respond within one business day.
              </p>

              {status === 'success' && (
                <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                  <i className="bi bi-check-circle-fill" />
                  <div>
                    <strong>Message sent!</strong> Thank you for reaching out. We'll be in touch shortly.
                  </div>
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                  <i className="bi bi-exclamation-triangle-fill" />
                  <div>Something went wrong. Please try again or email us directly.</div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="full_name">Full Name *</label>
                  <input id="full_name" name="full_name" className="form-control" required
                    value={form.full_name} onChange={handleChange} placeholder="John Smith" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address *</label>
                  <input id="email" name="email" type="email" className="form-control" required
                    value={form.email} onChange={handleChange} placeholder="john@company.com" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" className="form-control"
                    value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject *</label>
                  <input id="subject" name="subject" className="form-control" required
                    value={form.subject} onChange={handleChange} placeholder="Insurance enquiry" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="message">Message *</label>
                  <textarea id="message" name="message" className="form-control" required
                    value={form.message} onChange={handleChange}
                    placeholder="Tell us about your insurance needs..." rows={5} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                    {status === 'sending'
                      ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Sending…</>
                      : <><i className="bi bi-send" /> Send Message</>
                    }
                  </button>
                </div>
              </form>
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {contactInfo.map((info) => (
                <div key={info.title} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: 'var(--sw-navy)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'var(--sw-gold)', fontSize: '1.1rem', flexShrink: 0,
                  }}>
                    <i className={`bi ${info.icon}`} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem' }}>{info.title}</strong>
                    {info.lines.map((l) => (
                      <p key={l} style={{ fontSize: '0.85rem', color: 'var(--sw-text-muted)' }}>{l}</p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="card" style={{ padding: '1.5rem', background: 'var(--sw-navy)' }}>
                <h4 style={{ color: 'var(--sw-gold)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                  <i className="bi bi-exclamation-circle" /> Emergency Claims
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  For urgent claims support, call our 24/7 emergency line:
                </p>
                <p style={{ color: '#fff', fontWeight: 700, marginTop: '0.5rem' }}>+1 (800) 911-WAVE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}