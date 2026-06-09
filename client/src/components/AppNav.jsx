import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
  };

  const tabs = [
    { name: 'Dashboard', path: '/app' },
    { name: 'Documents', path: '/app/documents' },
    { name: 'My Saved Jobs', path: '/app/saved-jobs' },
    { name: 'Interview Prep', path: '/app/interview' },
    { name: 'Resume Examples', path: '/app/examples' },
  ];

  const isProfileActive = location.pathname === '/app/profile';

  return (
    <nav className="app-nav-light">
      {/* Logo */}
      <div
        className="nav-logo"
        onClick={() => navigate('/app')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', minWidth: 140 }}
      >
        <img src="/App_logo.png" alt="ResuMatch Logo" style={{ height: '32px', width: 'auto' }} />
        <span>ResuMatch<span className="logo-dot">.</span></span>
      </div>

      {/* Center nav tabs */}
      <div className="app-nav-tabs">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`app-nav-tab ${isActive ? 'active' : ''}`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Right: Avatar (links to profile) + Sign Out */}
      <div className="app-user-section" style={{ minWidth: 140, justifyContent: 'flex-end' }}>
        <div
          className="app-user-info"
          onClick={() => navigate('/app/profile')}
          style={{
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 9999,
            border: isProfileActive ? '1.5px solid rgba(124,58,237,0.4)' : '1.5px solid transparent',
            background: isProfileActive ? 'rgba(124,58,237,0.06)' : 'transparent',
            transition: 'all 0.2s',
          }}
          title="View Profile"
        >
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=7c3aed&color=fff`}
            className="app-avatar"
            alt="avatar"
            style={{ marginRight: 6 }}
          />
          <span className="app-username">
            {user?.displayName || user?.email?.split('@')[0]}
          </span>
        </div>
        <button className="app-btn-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  );
}
