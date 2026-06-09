import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import AppLayout from './AppLayout';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [nameEditing, setNameEditing] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDanger, setShowDanger] = useState(false);

  // Stats from user-scoped localStorage
  const analyses = (() => {
    if (!user?.uid) return [];
    try {
      const raw = localStorage.getItem(`analyses_${user.uid}`);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })();

  const totalScans = analyses.length;
  const avgScore = totalScans > 0
    ? Math.round(analyses.reduce((acc, a) => acc + a.matchScore, 0) / totalScans)
    : 0;
  const bestScore = totalScans > 0 ? Math.max(...analyses.map(a => a.matchScore)) : 0;

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setNameLoading(true);
    setNameMsg('');
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setNameMsg('Name updated successfully!');
      setNameEditing(false);
    } catch (err) {
      setNameMsg('Failed to update name. Try again.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwdError('');
    setPwdMsg('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    setPwdLoading(true);
    try {
      // Re-authenticate first for security
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPwdMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPwdError('Current password is incorrect.');
      } else {
        setPwdError('Failed to change password. Please try again.');
      }
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
  };

  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <AppLayout>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-light-dark)', letterSpacing: '-0.5px', marginBottom: 6 }}>
          My Account
        </h1>
        <p style={{ color: 'var(--text-light-muted)', fontSize: '1rem' }}>
          Manage your profile, security settings, and account preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28, alignItems: 'start' }}>

        {/* ─── LEFT: Avatar + Identity Card ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Avatar card */}
          <div className="app-liquid-card" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
              border: '3px solid rgba(124,58,237,0.2)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.15)',
              overflow: 'hidden'
            }}>
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=7c3aed&color=fff&size=180`}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-light-dark)', marginBottom: 4 }}>
              {user?.displayName || user?.email?.split('@')[0]}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)', marginBottom: 12 }}>{user?.email}</p>
            <span style={{
              display: 'inline-block',
              background: isGoogleUser ? 'rgba(66,133,244,0.1)' : 'rgba(124,58,237,0.1)',
              color: isGoogleUser ? '#4285f4' : '#7c3aed',
              border: `1px solid ${isGoogleUser ? 'rgba(66,133,244,0.25)' : 'rgba(124,58,237,0.25)'}`,
              padding: '4px 12px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600
            }}>
              {isGoogleUser ? '🔵 Google Account' : '📧 Email Account'}
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light-muted)', marginTop: 12 }}>
              Member since {memberSince}
            </p>
          </div>

          {/* Stats card */}
          <div className="app-liquid-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-light-dark)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '1px' }}>
              My Stats
            </h3>
            {[
              { label: 'Total Scans', value: totalScans },
              { label: 'Average Score', value: totalScans > 0 ? `${avgScore}%` : 'N/A' },
              { label: 'Best Score', value: totalScans > 0 ? `${bestScore}%` : 'N/A' },
            ].map((stat, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.05)' : 'none'
              }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-light-muted)' }}>{stat.label}</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-light-theme)' }}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <button
            className="app-btn-liquid"
            onClick={() => navigate('/app')}
            style={{ width: '100%', borderRadius: 14 }}
          >
            ← Back to Dashboard
          </button>
          <button
            className="app-btn-logout"
            onClick={handleLogout}
            style={{ width: '100%', borderRadius: 14, padding: '12px' }}
          >
            Sign Out
          </button>
        </div>

        {/* ─── RIGHT: Settings panels ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Edit Display Name */}
          <div className="app-liquid-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-light-dark)' }}>Display Name</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light-muted)', marginBottom: 20 }}>
              This is the name shown across your ResuMatch workspace.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                disabled={!nameEditing}
                placeholder="Your full name"
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 12,
                  border: `1px solid ${nameEditing ? 'rgba(124,58,237,0.4)' : 'rgba(0,0,0,0.08)'}`,
                  background: nameEditing ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.02)',
                  fontSize: '0.95rem', color: 'var(--text-light-dark)',
                  outline: 'none', transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              />
              {nameEditing ? (
                <>
                  <button className="app-btn-liquid" onClick={handleSaveName} disabled={nameLoading}
                    style={{ padding: '12px 20px', borderRadius: 12, whiteSpace: 'nowrap' }}>
                    {nameLoading ? '...' : 'Save'}
                  </button>
                  <button className="app-btn-logout" onClick={() => { setNameEditing(false); setDisplayName(user?.displayName || ''); }}
                    style={{ padding: '12px 16px', borderRadius: 12 }}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="app-btn-liquid app-btn-liquid-secondary" onClick={() => setNameEditing(true)}
                  style={{ padding: '12px 20px', borderRadius: 12, whiteSpace: 'nowrap' }}>
                  Edit
                </button>
              )}
            </div>
            {nameMsg && (
              <p style={{ marginTop: 10, fontSize: '0.85rem', color: nameMsg.includes('success') ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                {nameMsg}
              </p>
            )}
          </div>

          {/* Account Info */}
          <div className="app-liquid-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-light-dark)' }}>Account Information</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light-muted)', marginBottom: 20 }}>
              Your account details as registered with ResuMatch.
            </p>
            {[
              { label: 'Email Address', value: user?.email },
              { label: 'User ID', value: user?.uid?.slice(0, 16) + '...' },
              { label: 'Email Verified', value: user?.emailVerified ? '✅ Verified' : '⚠️ Not verified' },
              { label: 'Login Method', value: isGoogleUser ? 'Google OAuth 2.0' : 'Email & Password' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none'
              }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-light-muted)' }}>{item.label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-light-dark)', fontFamily: item.label === 'User ID' ? 'monospace' : 'inherit' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Change Password — only for email/password users */}
          {!isGoogleUser && (
            <div className="app-liquid-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-light-dark)' }}>Change Password</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light-muted)', marginBottom: 20 }}>
                For security, we require your current password before setting a new one.
              </p>
              {[
                { label: 'Current Password', val: currentPassword, set: setCurrentPassword },
                { label: 'New Password', val: newPassword, set: setNewPassword },
                { label: 'Confirm New Password', val: confirmPassword, set: setConfirmPassword },
              ].map((f, i) => (
                <input
                  key={i}
                  type="password"
                  placeholder={f.label}
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  style={{
                    display: 'block', width: '100%', marginBottom: 12,
                    padding: '12px 16px', borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.6)',
                    fontSize: '0.9rem', color: 'var(--text-light-dark)',
                    outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
                />
              ))}
              {pwdError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 10, fontWeight: 500 }}>{pwdError}</p>}
              {pwdMsg && <p style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: 10, fontWeight: 500 }}>{pwdMsg}</p>}
              <button
                className="app-btn-liquid"
                onClick={handleChangePassword}
                disabled={pwdLoading}
                style={{ borderRadius: 12, padding: '12px 24px' }}
              >
                {pwdLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}

          {isGoogleUser && (
            <div className="app-liquid-card" style={{ background: 'rgba(66,133,244,0.04)', border: '1px solid rgba(66,133,244,0.12)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#4285f4', marginBottom: 6 }}>Google Account</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light-muted)' }}>
                You are signed in via Google. Password changes are managed directly in your Google Account settings.
              </p>
            </div>
          )}

          {/* Danger zone */}
          <div className="app-liquid-card" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Danger Zone</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light-muted)', marginBottom: 16 }}>
              Clearing your local data removes all saved analysis history from this browser. This cannot be undone.
            </p>
            <button
              onClick={() => {
                if (user?.uid) {
                  localStorage.removeItem(`analyses_${user.uid}`);
                  alert('Your local analysis history has been cleared.');
                }
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                borderRadius: 10,
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.07)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              Clear My Analysis History
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
