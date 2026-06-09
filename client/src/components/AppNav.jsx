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
    { name: 'Prepare for Interview', path: '/app/interview' },
    { name: 'Resume Examples', path: '/app/examples' }
  ];

  return (
    <nav className="app-nav-light">
      <div className="nav-logo" onClick={() => navigate('/app')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/App_logo.png" alt="ResuMatch Logo" style={{ height: '32px', width: 'auto' }} />
        <span>ResuMatch<span className="logo-dot">.</span></span>
      </div>
      
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

      <div className="app-user-section">
        <div className="app-user-info">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=7c3aed&color=fff`}
            className="app-avatar"
            alt="avatar"
          />
          <span className="app-username">{user?.displayName || user?.email?.split('@')[0]}</span>
        </div>
        <button className="app-btn-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  );
}
