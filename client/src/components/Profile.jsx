import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import AppLayout from './AppLayout';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();

  const [displayName,     setDisplayName]     = useState(user?.displayName || '');
  const [nameEditing,     setNameEditing]      = useState(false);
  const [nameLoading,     setNameLoading]      = useState(false);
  const [nameMsg,         setNameMsg]          = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]      = useState('');
  const [confirmPassword, setConfirmPassword]  = useState('');
  const [pwdLoading,      setPwdLoading]       = useState(false);
  const [pwdMsg,          setPwdMsg]           = useState('');
  const [pwdError,        setPwdError]         = useState('');

  // ── Stats from localStorage ───────────────────────────────────────────────
  const analyses = (() => {
    if (!user?.uid) return [];
    try { return JSON.parse(localStorage.getItem(`analyses_${user.uid}`) || '[]'); }
    catch { return []; }
  })();
  const totalScans = analyses.length;
  const avgScore   = totalScans > 0 ? Math.round(analyses.reduce((a, b) => a + b.matchScore, 0) / totalScans) : 0;
  const bestScore  = totalScans > 0 ? Math.max(...analyses.map(a => a.matchScore)) : 0;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setNameLoading(true); setNameMsg('');
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setNameMsg('✅ Name updated!'); setNameEditing(false);
    } catch { setNameMsg('❌ Failed to update name.'); }
    finally { setNameLoading(false); }
  };

  const handleChangePassword = async () => {
    setPwdError(''); setPwdMsg('');
    if (!currentPassword || !newPassword || !confirmPassword) { setPwdError('Please fill all fields.'); return; }
    if (newPassword !== confirmPassword) { setPwdError('New passwords do not match.'); return; }
    if (newPassword.length < 6) { setPwdError('Password must be at least 6 characters.'); return; }
    setPwdLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newPassword);
      setPwdMsg('✅ Password changed!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPwdError(err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Current password is incorrect.' : 'Failed to change password.');
    } finally { setPwdLoading(false); }
  };

  const handleLogout = async () => { navigate('/', { replace: true }); await logout(); };

  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';
  const memberSince  = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';
  const avatarSrc    = user?.photoURL
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=7c3aed&color=fff&size=180`;

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .profile-page { font-family: 'Inter', system-ui, sans-serif; }

        /* Responsive two-column layout */
        .profile-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* Single-column on tablet/mobile */
        @media (max-width: 860px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .profile-left  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .profile-avatar-card { grid-column: 1 / -1; }
        }
        @media (max-width: 540px) {
          .profile-left { grid-template-columns: 1fr !important; }
        }

        /* Input styling */
        .pf-input {
          width: 100%; padding: 11px 14px; border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.6);
          font-size: 0.9rem; color: #0f172a;
          outline: none; font-family: 'Inter', system-ui, sans-serif;
          transition: border-color 0.18s, background 0.18s;
          box-sizing: border-box;
        }
        .pf-input:focus { border-color: rgba(124,58,237,0.45); background: #fff; }
        .pf-input:disabled { background: rgba(0,0,0,0.02); color: #64748b; }

        /* Info row */
        .info-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 12; padding: 13px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 0.85rem; color: #64748b; flex-shrink: 0; }
        .info-value {
          font-size: 0.85rem; font-weight: 600; color: #0f172a;
          text-align: right; word-break: break-all; max-width: 60%;
        }

        /* Glass card */
        .pf-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 20px; padding: 26px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        /* Stat chip */
        .stat-chip-pf {
          text-align: center; padding: 14px 10px;
          background: rgba(124,58,237,0.05); border-radius: 14px;
          flex: 1;
        }

        /* Mobile: cursor should be simple */
        @media (pointer: coarse) {
          *, *::before, *::after { cursor: auto !important; }
          button, a, label, select, [role="button"], [tabindex] { cursor: pointer !important; }
        }
      `}</style>

      <div className="profile-page">

        {/* ── Page Header ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1.8px', marginBottom: 8 }}>
            Account
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 6 }}>
            My Profile
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage your identity, security settings, and account preferences.
          </p>
        </div>

        <div className="profile-grid">

          {/* ════ LEFT COLUMN ════ */}
          <div className="profile-left" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Avatar card */}
            <div className="pf-card profile-avatar-card" style={{ textAlign: 'center' }}>
              {/* Purple banner */}
              <div style={{
                height: 80, borderRadius: '14px 14px 0 0', margin: '-26px -26px 0',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4f46e5 100%)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
              </div>

              {/* Avatar overlapping banner */}
              <div style={{ position: 'relative', marginTop: -44, marginBottom: 14, display: 'inline-block' }}>
                <div style={{
                  width: 84, height: 84, borderRadius: '50%',
                  border: '3px solid #fff',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.2)',
                  overflow: 'hidden', background: '#f1f5f9',
                }}>
                  <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Online dot */}
                <div style={{
                  position: 'absolute', bottom: 4, right: 4,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#10b981', border: '2px solid #fff',
                }} />
              </div>

              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 12, wordBreak: 'break-all' }}>
                {user?.email}
              </p>
              <span style={{
                display: 'inline-block',
                background: isGoogleUser ? 'rgba(66,133,244,0.1)' : 'rgba(124,58,237,0.1)',
                color:      isGoogleUser ? '#4285f4'                : '#7c3aed',
                border:     `1px solid ${isGoogleUser ? 'rgba(66,133,244,0.25)' : 'rgba(124,58,237,0.25)'}`,
                padding: '4px 12px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
              }}>
                {isGoogleUser ? '🔵 Google Account' : '📧 Email Account'}
              </span>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 10 }}>
                Member since {memberSince}
              </p>
            </div>

            {/* Stats card */}
            <div className="pf-card">
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>
                My Stats
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Scans', value: totalScans,                    color: '#7c3aed' },
                  { label: 'Avg Score', value: totalScans > 0 ? `${avgScore}%`  : '—', color: '#2563eb' },
                  { label: 'Best',  value: totalScans > 0 ? `${bestScore}%` : '—', color: '#059669' },
                ].map((s, i) => (
                  <div key={i} className="stat-chip-pf">
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick nav */}
            <button
              onClick={() => navigate('/app')}
              style={{
                width: '100%', padding: '12px', borderRadius: 14,
                background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff',
                border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                fontFamily: 'Inter,system-ui,sans-serif',
                boxShadow: '0 4px 14px rgba(124,58,237,0.25)',
              }}
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '11px', borderRadius: 14,
                background: 'transparent', color: '#ef4444',
                border: '1.5px solid rgba(239,68,68,0.25)', fontWeight: 600,
                fontSize: '0.88rem', cursor: 'pointer',
                fontFamily: 'Inter,system-ui,sans-serif',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Sign Out
            </button>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Display Name */}
            <div className="pf-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Display Name</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 18 }}>
                Shown across your ResuMatch workspace.
              </p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="pf-input"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  disabled={!nameEditing}
                  placeholder="Your full name"
                  style={{ flex: '1 1 180px', minWidth: 0 }}
                />
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {nameEditing ? (
                    <>
                      <button
                        onClick={handleSaveName}
                        disabled={nameLoading}
                        style={{
                          padding: '11px 18px', borderRadius: 12, border: 'none',
                          background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff',
                          fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                          fontFamily: 'inherit', whiteSpace: 'nowrap',
                        }}
                      >{nameLoading ? '...' : 'Save'}</button>
                      <button
                        onClick={() => { setNameEditing(false); setDisplayName(user?.displayName || ''); }}
                        style={{
                          padding: '11px 14px', borderRadius: 12,
                          border: '1.5px solid rgba(0,0,0,0.09)', background: '#fff',
                          color: '#64748b', fontWeight: 600, fontSize: '0.85rem',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setNameEditing(true)}
                      style={{
                        padding: '11px 18px', borderRadius: 12,
                        border: '1.5px solid rgba(124,58,237,0.3)',
                        background: 'rgba(124,58,237,0.06)', color: '#7c3aed',
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                        fontFamily: 'inherit', whiteSpace: 'nowrap',
                      }}
                    >Edit</button>
                  )}
                </div>
              </div>
              {nameMsg && (
                <p style={{ marginTop: 10, fontSize: '0.82rem', color: nameMsg.includes('✅') ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {nameMsg}
                </p>
              )}
            </div>

            {/* Account Information */}
            <div className="pf-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Account Information</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 18 }}>
                Your account details as registered with ResuMatch.
              </p>
              {[
                { label: 'Email Address',  value: user?.email },
                { label: 'User ID',        value: user?.uid?.slice(0, 16) + '…', mono: true },
                { label: 'Email Verified', value: user?.emailVerified ? '✅ Verified' : '⚠️ Not verified' },
                { label: 'Login Method',   value: isGoogleUser ? 'Google OAuth 2.0' : 'Email & Password' },
              ].map((item, i) => (
                <div key={i} className="info-row">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value" style={{ fontFamily: item.mono ? 'monospace' : 'inherit' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Password — email users only */}
            {!isGoogleUser && (
              <div className="pf-card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Change Password</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 18 }}>
                  We require your current password for security before setting a new one.
                </p>
                {[
                  { placeholder: 'Current Password',     val: currentPassword, set: setCurrentPassword },
                  { placeholder: 'New Password',         val: newPassword,     set: setNewPassword },
                  { placeholder: 'Confirm New Password', val: confirmPassword, set: setConfirmPassword },
                ].map((f, i) => (
                  <input
                    key={i}
                    type="password"
                    className="pf-input"
                    placeholder={f.placeholder}
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    style={{ display: 'block', marginBottom: 12 }}
                  />
                ))}
                {pwdError && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: 10, fontWeight: 600 }}>{pwdError}</p>}
                {pwdMsg   && <p style={{ color: '#10b981', fontSize: '0.82rem', marginBottom: 10, fontWeight: 600 }}>{pwdMsg}</p>}
                <button
                  onClick={handleChangePassword}
                  disabled={pwdLoading}
                  style={{
                    padding: '12px 24px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff',
                    fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >{pwdLoading ? 'Updating…' : 'Update Password'}</button>
              </div>
            )}

            {/* Google SSO notice */}
            {isGoogleUser && (
              <div className="pf-card" style={{ background: 'rgba(66,133,244,0.04)', border: '1px solid rgba(66,133,244,0.15)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4285f4', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🔵 Google Account Connected
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
                  You're signed in via Google OAuth. Password changes are managed in your
                  {' '}<a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer"
                    style={{ color: '#4285f4', fontWeight: 600, textDecoration: 'none' }}>
                    Google Account settings ↗
                  </a>.
                </p>
              </div>
            )}

            {/* Danger Zone */}
            <div className="pf-card" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.02)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>Danger Zone</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
                Clearing local data removes all saved analysis history from this browser. This cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (user?.uid) {
                    localStorage.removeItem(`analyses_${user.uid}`);
                    alert('Your local analysis history has been cleared.');
                  }
                }}
                style={{
                  background: 'transparent', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', borderRadius: 10, padding: '10px 20px',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'background 0.18s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                🗑️ Clear My Analysis History
              </button>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
