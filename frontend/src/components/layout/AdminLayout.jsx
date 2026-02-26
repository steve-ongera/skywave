import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2', end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: 'bi-clipboard2-pulse' },
  { to: '/admin/messages', label: 'Messages', icon: 'bi-envelope' },
  { to: '/admin/jobs', label: 'Job Postings', icon: 'bi-briefcase', roles: ['admin','manager'] },
  { to: '/admin/applications', label: 'Applications', icon: 'bi-person-lines-fill', roles: ['admin','manager'] },
  { to: '/admin/faqs', label: 'FAQs', icon: 'bi-question-circle', roles: ['admin'] },
  { to: '/admin/staff', label: 'Staff Users', icon: 'bi-people', roles: ['admin'] },
  { to: '/admin/profile', label: 'My Profile', icon: 'bi-person-circle' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className={`admin-layout${collapsed ? ' admin-layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link to="/">
            <i className="bi bi-cloud-lightning-fill" />
            {!collapsed && <span>SkyWave</span>}
          </Link>
          <button className="admin-sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
            <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} />
          </button>
        </div>

        <nav className="admin-nav">
          {visibleItems.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav__item${isActive ? ' active' : ''}`}>
              <i className={`bi ${icon}`} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            {!collapsed && (
              <div className="admin-sidebar__user-info">
                <span className="admin-sidebar__user-name">{user?.full_name}</span>
                <span className="admin-sidebar__user-role badge badge-gold">{user?.role}</span>
              </div>
            )}
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout} title="Logout">
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <Outlet />
      </main>

      <style>{`
        .admin-layout {
          display: flex; min-height: 100vh;
          background: var(--sw-off-white);
        }
        .admin-sidebar {
          width: 260px; flex-shrink: 0;
          background: var(--sw-navy);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
          transition: width 0.3s ease;
          overflow: hidden;
        }
        .admin-layout--collapsed .admin-sidebar { width: 64px; }
        .admin-sidebar__brand {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .admin-sidebar__brand a {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: var(--font-display);
          font-size: 1.3rem; font-weight: 700; color: #fff;
          white-space: nowrap; overflow: hidden;
        }
        .admin-sidebar__brand i { color: var(--sw-gold); flex-shrink: 0; }
        .admin-sidebar__toggle {
          background: transparent; border: none;
          color: rgba(255,255,255,0.4); font-size: 0.85rem;
          padding: 0.25rem; cursor: pointer;
          transition: var(--transition);
        }
        .admin-sidebar__toggle:hover { color: #fff; }
        .admin-nav {
          flex: 1; padding: 1rem 0.5rem;
          overflow-y: auto;
        }
        .admin-nav__item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.7rem 0.75rem;
          color: rgba(255,255,255,0.6);
          border-radius: var(--radius-sm);
          font-size: 0.88rem; font-weight: 500;
          transition: var(--transition);
          white-space: nowrap;
          margin-bottom: 2px;
        }
        .admin-nav__item i { font-size: 1.05rem; flex-shrink: 0; }
        .admin-nav__item:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .admin-nav__item.active { color: var(--sw-gold); background: rgba(201,168,76,0.12); }
        .admin-sidebar__footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
        }
        .admin-sidebar__user { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
        .admin-sidebar__avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--sw-gold);
          color: var(--sw-navy);
          font-weight: 700; font-size: 0.75rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .admin-sidebar__user-info { display: flex; flex-direction: column; min-width: 0; }
        .admin-sidebar__user-name {
          font-size: 0.82rem; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .admin-sidebar__user-role { font-size: 0.65rem; width: fit-content; }
        .admin-sidebar__logout {
          background: transparent; border: none;
          color: rgba(255,255,255,0.4); font-size: 1rem;
          padding: 0.35rem; cursor: pointer;
          transition: var(--transition); flex-shrink: 0;
        }
        .admin-sidebar__logout:hover { color: var(--sw-danger); }
        .admin-main { flex: 1; min-width: 0; padding: 2rem; overflow-y: auto; }
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
          .admin-main { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}