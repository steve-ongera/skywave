import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { inquiryService, contactService, jobsService, applicationsService } from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ inquiries: 0, messages: 0, jobs: 0, applications: 0 });

  useEffect(() => {
    Promise.allSettled([
      inquiryService.list({ page_size: 1 }),
      contactService.list({ page_size: 1 }),
      jobsService.list({ page_size: 1 }),
      applicationsService.list({ page_size: 1 }),
    ]).then(([inq, msg, jobs, apps]) => {
      setStats({
        inquiries: inq.value?.data?.count || inq.value?.data?.length || 0,
        messages: msg.value?.data?.count || msg.value?.data?.length || 0,
        jobs: jobs.value?.data?.count || jobs.value?.data?.length || 0,
        applications: apps.value?.data?.count || apps.value?.data?.length || 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Total Inquiries', value: stats.inquiries, icon: 'bi-clipboard2-pulse', color: 'var(--sw-sky)', to: '/admin/inquiries' },
    { label: 'Contact Messages', value: stats.messages, icon: 'bi-envelope', color: 'var(--sw-gold)', to: '/admin/messages' },
    { label: 'Active Job Posts', value: stats.jobs, icon: 'bi-briefcase', color: 'var(--sw-success)', to: '/admin/jobs' },
    { label: 'Job Applications', value: stats.applications, icon: 'bi-person-lines-fill', color: 'var(--sw-warning)', to: '/admin/applications' },
  ];

  const quickLinks = [
    { to: '/admin/inquiries', icon: 'bi-clipboard2-pulse', label: 'View Inquiries', desc: 'Review and update insurance inquiries' },
    { to: '/admin/messages', icon: 'bi-envelope-open', label: 'View Messages', desc: 'Read and respond to contact messages' },
    { to: '/admin/jobs', icon: 'bi-plus-circle', label: 'Manage Jobs', desc: 'Post and manage career openings', roles: ['admin','manager'] },
    { to: '/admin/applications', icon: 'bi-people', label: 'Applications', desc: 'Review job applications', roles: ['admin','manager'] },
    { to: '/admin/faqs', icon: 'bi-question-circle', label: 'Manage FAQs', desc: 'Edit frequently asked questions', roles: ['admin'] },
    { to: '/admin/staff', icon: 'bi-person-plus', label: 'Manage Staff', desc: 'Add and manage staff accounts', roles: ['admin'] },
  ];

  const visibleLinks = quickLinks.filter(l => !l.roles || l.roles.includes(user?.role));

  return (
    <>
      <Helmet><title>Dashboard – SkyWave Admin</title></Helmet>

      <div>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.first_name} 👋
          </h1>
          <p style={{ color: 'var(--sw-text-muted)' }}>Here's a summary of your SkyWave admin portal.</p>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {cards.map((card) => (
            <Link key={card.label} to={card.to} className="admin-stat-card">
              <div className="admin-stat-card__icon" style={{ background: `${card.color}18`, color: card.color }}>
                <i className={`bi ${card.icon}`} />
              </div>
              <div>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </div>
              <i className="bi bi-arrow-right admin-stat-card__arrow" />
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
          <div className="grid-3">
            {visibleLinks.map((link) => (
              <Link key={link.to} to={link.to} className="admin-quick-card">
                <i className={`bi ${link.icon}`} />
                <div>
                  <strong>{link.label}</strong>
                  <span>{link.desc}</span>
                </div>
                <i className="bi bi-chevron-right" style={{ marginLeft: 'auto', color: 'var(--sw-text-muted)', fontSize: '0.85rem' }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Role info */}
        <div style={{ marginTop: '2.5rem', padding: '1.25rem 1.5rem', background: 'var(--sw-gold-pale)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="bi bi-person-badge" style={{ fontSize: '1.25rem', color: 'var(--sw-gold)' }} />
            <div>
              <strong style={{ fontSize: '0.9rem' }}>Signed in as: {user?.full_name}</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sw-text-muted)', textTransform: 'capitalize' }}>
                Role: {user?.role} · {user?.department || 'No department set'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-stat-card {
          background: #fff; border: 1px solid var(--sw-border);
          border-radius: var(--radius-lg); padding: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          transition: var(--transition);
        }
        .admin-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .admin-stat-card__icon {
          width: 48px; height: 48px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.25rem; flex-shrink: 0;
        }
        .admin-stat-card strong { display: block; font-size: 1.6rem; font-family: var(--font-display); color: var(--sw-navy); }
        .admin-stat-card span { font-size: 0.78rem; color: var(--sw-text-muted); font-weight: 500; }
        .admin-stat-card__arrow { margin-left: auto; color: var(--sw-border); }
        .admin-stat-card:hover .admin-stat-card__arrow { color: var(--sw-gold); }

        .admin-quick-card {
          background: #fff; border: 1px solid var(--sw-border);
          border-radius: var(--radius-md); padding: 1.25rem;
          display: flex; align-items: center; gap: 1rem;
          transition: var(--transition);
        }
        .admin-quick-card:hover { border-color: var(--sw-gold); background: var(--sw-gold-pale); }
        .admin-quick-card > i:first-child { font-size: 1.35rem; color: var(--sw-navy); flex-shrink: 0; }
        .admin-quick-card strong { display: block; font-size: 0.9rem; }
        .admin-quick-card span { display: block; font-size: 0.78rem; color: var(--sw-text-muted); }
      `}</style>
    </>
  );
}