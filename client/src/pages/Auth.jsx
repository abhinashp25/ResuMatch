import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simple but robust email format check
  const isValidEmail = (val) => {
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(val);
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address (e.g. yourname@gmail.com).');
      return;
    }
    if (!isLogin && !fullName) {
      setError('Please enter your full name to create an account.');
      return;
    }
    if (!isLogin && fullName.trim().length < 2) {
      setError('Please enter your real full name (at least 2 characters).');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName.trim() });
      }
      navigate('/app');
    } catch (err) {
      console.error(err);
      let errMsg = 'An unexpected error occurred. Please try again.';
      switch (err.code) {
        case 'auth/user-not-found':
          errMsg = '❌ No account exists for this email. Please switch to Sign Up to create one.';
          break;
        case 'auth/wrong-password':
          errMsg = '❌ Incorrect password. Please check your password and try again.';
          break;
        case 'auth/invalid-credential':
          errMsg = '❌ Email or password is incorrect. If you are new here, please use the Sign Up tab to register first.';
          break;
        case 'auth/email-already-in-use':
          errMsg = '⚠️ This email is already registered. Switch to Sign In to access your account.';
          break;
        case 'auth/invalid-email':
          errMsg = '❌ Invalid email format. Please enter a valid email like yourname@gmail.com.';
          break;
        case 'auth/weak-password':
          errMsg = '⚠️ Your password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
          break;
        case 'auth/too-many-requests':
          errMsg = '⚠️ Too many failed attempts. Your account is temporarily locked. Please try again in a few minutes or reset your password.';
          break;
        case 'auth/network-request-failed':
          errMsg = '❌ Network error. Please check your internet connection and try again.';
          break;
        default:
          errMsg = err.message || errMsg;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${isLogin ? 'auth-signin-state' : 'auth-signup-state'}`}>
      <div 
        className="auth-bg-layer" 
        style={{ 
          backgroundImage: 'url(/Login.png)', 
          opacity: isLogin ? 0.45 : 0 
        }} 
      />
      <div 
        className="auth-bg-layer" 
        style={{ 
          backgroundImage: 'url(/Sign_up.png)', 
          opacity: !isLogin ? 0.45 : 0 
        }} 
      />
      
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'radial-gradient(circle, rgba(2,2,5,0.3) 0%, rgba(2,2,5,0.85) 100%)', 
          zIndex: 1 
        }} 
      />

      <div className="auth-card liquid-glass">
        <div className="auth-logo" onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <img src="/App_logo.png" alt="ResuMatch Logo" style={{ height: '36px', width: 'auto' }} />
          <span>ResuMatch<span className="logo-dot">.</span></span>
        </div>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-sub">
          {isLogin ? 'Sign in to analyze your resume' : 'Start for free — no credit card needed'}
        </p>

        <div className="auth-toggle" style={{ position: 'relative', zIndex: 10 }}>
          <button className={isLogin ? 'active' : ''} onClick={() => { setIsLogin(true); setError(''); }}>Sign In</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => { setIsLogin(false); setError(''); }}>Sign Up</button>
        </div>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="auth-input"
            style={{ position: 'relative', zIndex: 10 }}
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="auth-input"
          style={{ position: 'relative', zIndex: 10 }}
        />

        <div style={{ position: 'relative', width: '100%', zIndex: 10, marginBottom: '12px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
            style={{ width: '100%', paddingRight: '44px', marginBottom: 0 }}
            onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              fontSize: '1rem',
              outline: 'none',
              padding: '4px'
            }}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {error && <p className="error" style={{ position: 'relative', zIndex: 10 }}>{error}</p>}

        <button className="btn-primary w-full" onClick={handleEmailAuth} disabled={loading} style={{ position: 'relative', zIndex: 10 }}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <div className="divider" style={{ position: 'relative', zIndex: 10 }}><span>or</span></div>

        <button className="btn-google" onClick={handleGoogle} disabled={loading} style={{ position: 'relative', zIndex: 10 }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
          Continue with Google
        </button>

        <div style={{ marginTop: '20px', position: 'relative', zIndex: 10 }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn-ghost" 
            style={{ 
              width: '100%', 
              background: 'transparent', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              color: '#94a3b8',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}