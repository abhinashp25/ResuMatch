import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const NAV_ICONS = {
  Dashboard:
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Documents:
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  'My Saved Jobs':
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  'Interview Prep':
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  'Resume Examples':
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

const PROFILE_ICON =
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;

const SIGNOUT_ICON =
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

// ─── Nav tab definitions ──────────────────────────────────────────────────────
const TABS = [
  { name: 'Dashboard',       path: '/app' },
  { name: 'Documents',       path: '/app/documents' },
  { name: 'My Saved Jobs',   path: '/app/saved-jobs' },
  { name: 'Interview Prep',  path: '/app/interview' },
  { name: 'Resume Examples', path: '/app/examples' },
];

export default function AppNav() {
  const { user, logout }  = useAuth();
  const location          = useLocation();
  const navigate          = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-close when route changes
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close on outside tap
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!e.target.closest('#mobile-nav-menu') && !e.target.closest('#hamburger-btn')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    navigate('/', { replace: true });
    await logout();
  };

  const isProfileActive  = location.pathname === '/app/profile';
  const avatarSrc        = user?.photoURL
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=7c3aed&color=fff&size=80`;
  const firstName        = (user?.displayName || user?.email?.split('@')[0] || 'User').split(' ')[0];
  const fullName         = user?.displayName  || user?.email?.split('@')[0] || 'User';

  return (
    <>
      {/* ── Responsive nav CSS ── */}
      <style>{`
        /* ── Hamburger button (hidden on desktop) ── */
        #hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          background: transparent;
          border: 1.5px solid rgba(0,0,0,0.09);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        #hamburger-btn:hover { background: rgba(0,0,0,0.05); }

        #hamburger-btn .bar {
          display: block;
          width: 18px;
          height: 2px;
          background: #0f172a;
          border-radius: 2px;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1),
                      opacity  0.18s ease,
                      width    0.18s ease;
        }
        #hamburger-btn.open .bar:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        #hamburger-btn.open .bar:nth-child(2) { opacity: 0; width: 0; }
        #hamburger-btn.open .bar:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* ── Mobile slide-down drawer ── */
        #mobile-nav-menu {
          display: none;
          position: fixed;
          top: 61px;       /* height of the sticky nav */
          left: 0; right: 0;
          z-index: 98;
          padding: 10px 12px 16px;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(24px) saturate(190%);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 20px 48px rgba(0,0,0,0.09);
          animation: mobileNavIn 0.22s cubic-bezier(.34,1.56,.64,1) both;
        }
        #mobile-nav-menu.open { display: block; }

        @keyframes mobileNavIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mnav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 14px;
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          font-size: 0.91rem;
          font-family: 'Inter', system-ui, sans-serif;
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          -webkit-tap-highlight-color: transparent;
        }
        .mnav-item:hover  { background: rgba(0,0,0,0.04); color: #0f172a; }
        .mnav-item.active { background: rgba(124,58,237,0.09); color: #7c3aed; font-weight: 700; }

        .mnav-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(0,0,0,0.04);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.14s;
        }
        .mnav-item.active .mnav-icon { background: rgba(124,58,237,0.12); color: #7c3aed; }

        .mnav-divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 6px 14px;
        }

        /* ── Responsive breakpoint ── */
        @media (max-width: 768px) {
          #hamburger-btn         { display: flex !important; }
          .app-nav-desktop-tabs  { display: none !important; }
          .app-nav-desktop-user  { display: none !important; }
          .app-nav-light         { padding: 10px 16px !important; }
        }
      `}</style>

      {/* ────────────────────── Sticky top nav bar ────────────────────── */}
      <nav className="app-nav-light" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Logo */}
        <div
          onClick={() => navigate('/app')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, minWidth: 'max-content' }}
        >
          <img src="/App_logo.png" alt="ResuMatch" style={{ height: 30, width: 'auto' }} />
          <span className="nav-logo" style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.3px', fontFamily: "'Inter', system-ui, sans-serif", whiteSpace: 'nowrap' }}>
            ResuMatch<span className="logo-dot">.</span>
          </span>
        </div>

        {/* ── Desktop center tabs ── */}
        <div className="app-nav-tabs app-nav-desktop-tabs">
          {TABS.map(tab => {
            const active = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`app-nav-tab ${active ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <span style={{ opacity: active ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                  {NAV_ICONS[tab.name]}
                </span>
                {tab.name}
              </Link>
            );
          })}
        </div>

        {/* ── Desktop user + sign out ── */}
        <div className="app-user-section app-nav-desktop-user" style={{ minWidth: 140, justifyContent: 'flex-end' }}>
          <div
            className="app-user-info"
            onClick={() => navigate('/app/profile')}
            style={{
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: 9999,
              border:      isProfileActive ? '1.5px solid rgba(124,58,237,0.35)' : '1.5px solid transparent',
              background:  isProfileActive ? 'rgba(124,58,237,0.06)' : 'transparent',
              transition:  'all 0.2s',
            }}
            title="View Profile"
          >
            <img src={avatarSrc} className="app-avatar" alt="avatar" style={{ marginRight: 7 }} />
            <span className="app-username">{firstName}</span>
          </div>
          <button className="app-btn-logout" onClick={handleLogout}>Sign Out</button>
        </div>

        {/* ── Mobile hamburger button ── */}
        <button
          id="hamburger-btn"
          className={menuOpen ? 'open' : ''}
          onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </nav>

      {/* ────────────────────── Mobile slide-down drawer ────────────────────── */}
      <div id="mobile-nav-menu" className={menuOpen ? 'open' : ''}>

        {/* Nav links */}
        {TABS.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`mnav-item ${active ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <div className="mnav-icon">{NAV_ICONS[tab.name]}</div>
              <span>{tab.name}</span>
              {active && (
                <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
              )}
            </Link>
          );
        })}

        <div className="mnav-divider" />

        {/* Profile row */}
        <button
          className={`mnav-item ${isProfileActive ? 'active' : ''}`}
          onClick={() => { navigate('/app/profile'); setMenuOpen(false); }}
        >
          <img
            src={avatarSrc}
            alt="avatar"
            style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 }}
          />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{fullName}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>View Profile</div>
          </div>
        </button>

        {/* Sign out */}
        <button
          className="mnav-item"
          onClick={handleLogout}
          style={{ color: '#ef4444', marginTop: 2 }}
        >
          <div className="mnav-icon" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>{SIGNOUT_ICON}</div>
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}
