import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Careers', to: '/careers' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setOpen(false), [location]);

  return (
    <>
      <nav className={`sw-nav${scrolled ? ' sw-nav--scrolled' : ''}`}>
        <div className="container sw-nav__inner">
          {/* Logo */}
          <Link to="/" className="sw-nav__logo">
            <i className="bi bi-cloud-lightning-fill" />
            <span>SkyWave</span>
          </Link>

          {/* Desktop links */}
          <ul className="sw-nav__links">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''} end={to === '/'}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="sw-nav__actions">
            <Link to="/get-quote" className="btn btn-primary btn-sm">
              <i className="bi bi-file-earmark-text" />
              Get a Quote
            </Link>
            <button
              className="sw-nav__burger"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`sw-mobile-nav${open ? ' sw-mobile-nav--open' : ''}`}>
        <ul>
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/get-quote" className="btn btn-primary w-100" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <i className="bi bi-file-earmark-text" /> Get a Quote
            </Link>
          </li>
        </ul>
      </div>

      <style>{`
        .sw-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 1.25rem 0;
          transition: var(--transition);
          background: transparent;
        }
        .sw-nav--scrolled {
          background: rgba(10,22,40,0.97);
          backdrop-filter: blur(12px);
          padding: 0.75rem 0;
          box-shadow: var(--shadow-lg);
        }
        .sw-nav__inner {
          display: flex; align-items: center; justify-content: space-between;
        }
        .sw-nav__logo {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
        }
        .sw-nav__logo i { font-size: 1.4rem; color: var(--sw-gold); }
        .sw-nav__links {
          list-style: none; display: flex; align-items: center; gap: 0.25rem;
        }
        .sw-nav__links a {
          display: block; padding: 0.4rem 0.85rem;
          font-size: 0.88rem; font-weight: 500;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.04em;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .sw-nav__links a:hover, .sw-nav__links a.active {
          color: #fff;
          background: rgba(201,168,76,0.15);
        }
        .sw-nav__links a.active { color: var(--sw-gold); }
        .sw-nav__actions { display: flex; align-items: center; gap: 1rem; }
        .sw-nav__burger {
          display: none; background: transparent; border: none;
          color: #fff; font-size: 1.5rem; line-height: 1;
        }
        .sw-mobile-nav {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(320px, 85vw);
          background: var(--sw-navy);
          z-index: 999;
          padding: 5rem 2rem 2rem;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
          box-shadow: -8px 0 40px rgba(0,0,0,0.4);
        }
        .sw-mobile-nav--open { transform: translateX(0); }
        .sw-mobile-nav ul { list-style: none; }
        .sw-mobile-nav li + li { margin-top: 0.25rem; }
        .sw-mobile-nav a {
          display: block; padding: 0.85rem 1rem;
          font-size: 1rem; font-weight: 500;
          color: rgba(255,255,255,0.85);
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .sw-mobile-nav a:hover, .sw-mobile-nav a.active {
          color: var(--sw-gold);
          background: rgba(201,168,76,0.1);
        }
        @media (max-width: 900px) {
          .sw-nav__links { display: none; }
          .sw-nav__burger { display: block; }
        }
      `}</style>
    </>
  );
}