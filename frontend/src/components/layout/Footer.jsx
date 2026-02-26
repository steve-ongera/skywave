import { Link } from 'react-router-dom';

const services = [
  { label: 'Fleet Insurance', to: '/services/fleet-insurance' },
  { label: 'Aircraft Insurance', to: '/services/aircraft-insurance' },
  { label: 'Yacht Insurance', to: '/services/yacht-insurance' },
];

const company = [
  { label: 'About SkyWave', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="sw-footer">
      <div className="sw-footer__top">
        <div className="container sw-footer__grid">
          {/* Brand */}
          <div className="sw-footer__brand">
            <Link to="/" className="sw-footer__logo">
              <i className="bi bi-cloud-lightning-fill" />
              SkyWave
            </Link>
            <p>
              Specialist insurance for commercial fleets, private and commercial aircraft,
              and luxury yachts. Protecting what moves you — on land, sea, and sky.
            </p>
            <div className="sw-footer__social">
              <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
              <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x" /></a>
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram" /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h5>Our Services</h5>
            <ul>
              {services.map((s) => (
                <li key={s.to}><Link to={s.to}>{s.label}</Link></li>
              ))}
              <li><Link to="/get-quote">Get a Quote</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5>Company</h5>
            <ul>
              {company.map((c) => (
                <li key={c.to}><Link to={c.to}>{c.label}</Link></li>
              ))}
              <li><Link to="/admin/login">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5>Get in Touch</h5>
            <ul className="sw-footer__contact-list">
              <li><i className="bi bi-telephone" /> +1 (800) SKY-WAVE</li>
              <li><i className="bi bi-envelope" /> info@skywave-insurance.com</li>
              <li><i className="bi bi-geo-alt" /> 1 Maritime Plaza, Suite 900<br />San Francisco, CA 94111</li>
              <li><i className="bi bi-clock" /> Mon–Fri 8 am – 6 pm PST</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sw-footer__bottom">
        <div className="container flex-between flex-wrap gap-2">
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} SkyWave Insurance Group. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <a key={l} href="#" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sw-footer {
          background: var(--sw-navy);
          color: rgba(255,255,255,0.7);
        }
        .sw-footer__top { padding: 5rem 0 3rem; }
        .sw-footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }
        .sw-footer__logo {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: var(--font-display);
          font-size: 1.6rem; font-weight: 700;
          color: #fff; margin-bottom: 1rem;
        }
        .sw-footer__logo i { color: var(--sw-gold); }
        .sw-footer__brand p { font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem; }
        .sw-footer__social {
          display: flex; gap: 0.75rem;
        }
        .sw-footer__social a {
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.6);
          transition: var(--transition);
          font-size: 0.95rem;
        }
        .sw-footer__social a:hover {
          border-color: var(--sw-gold);
          color: var(--sw-gold);
          background: rgba(201,168,76,0.1);
        }
        .sw-footer h5 {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--sw-gold);
          margin-bottom: 1.25rem;
        }
        .sw-footer ul { list-style: none; }
        .sw-footer ul li { margin-bottom: 0.6rem; }
        .sw-footer ul a {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.6);
          transition: var(--transition);
        }
        .sw-footer ul a:hover { color: #fff; padding-left: 4px; }
        .sw-footer__contact-list li {
          display: flex; align-items: flex-start; gap: 0.65rem;
          font-size: 0.88rem; margin-bottom: 0.75rem;
        }
        .sw-footer__contact-list i { color: var(--sw-gold); margin-top: 3px; flex-shrink: 0; }
        .sw-footer__bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 1.25rem 0;
        }
        @media (max-width: 1024px) {
          .sw-footer__grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .sw-footer__grid { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>
    </footer>
  );
}