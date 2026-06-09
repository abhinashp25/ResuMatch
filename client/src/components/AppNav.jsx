import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Inline SVG icons for nav tabs ───
const NAV_ICONS = {
  Dashboard:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Documents:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  'My Saved Jobs': <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  'Interview Prep':<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  'Resume Examples':<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

export default function AppNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
  };

  const tabs = [
    { name: 'Dashboard',       path: '/app' },
    { name: 'Documents',       path: '/app/documents' },
    { name: 'My Saved Jobs',   path: '/app/saved-jobs' },
    { name: 'Interview Prep',  path: '/app/interview' },
    { name: 'Resume Examples', path: '/app/examples' },
  ];

  const isProfileActive = location.pathname === '/app/profile';

  return (
    <nav className="app-nav-light" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Logo ── */}
      <div
        onClick={() => navigate('/app')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, minWidth: 140 }}
      >
        <img src="/App_logo.png" alt="ResuMatch" style={{ height: 30, width: 'auto' }} />
        <span className="nav-logo" style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.3px', fontFamily: "'Inter', system-ui, sans-serif" }}>
          ResuMatch<span className="logo-dot">.</span>
        </span>
      </div>

      {/* ── Center Tabs ── */}
      <div className="app-nav-tabs">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`app-nav-tab ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                {NAV_ICONS[tab.name]}
              </span>
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* ── User + Sign Out ── */}
      <div className="app-user-section" style={{ minWidth: 140, justifyContent: 'flex-end' }}>
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
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=7c3aed&color=fff&size=80`}
            className="app-avatar"
            alt="avatar"
            style={{ marginRight: 7 }}
          />
          <span className="app-username">
            {(user?.displayName || user?.email?.split('@')[0] || 'User').split(' ')[0]}
          </span>
        </div>

        <button className="app-btn-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  );
}
