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

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !fullName) {
      setError('Please enter your full name to sign up.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
      }
      navigate('/app');
    } catch (err) {
      console.error(err);
      let errMsg = 'An unexpected error occurred. Please try again.';
      switch (err.code) {
        case 'auth/user-not-found':
          errMsg = 'No account found with this email. Please click the "Sign Up" tab above to register first.';
          break;
        case 'auth/wrong-password':
          errMsg = 'Incorrect password. Please verify your password and try again.';
          break;
        case 'auth/invalid-credential':
          errMsg = 'Invalid credentials. If you are a new user, please click the "Sign Up" tab above to register first.';
          break;
        case 'auth/email-already-in-use':
          errMsg = 'This email is already registered. Please sign in instead.';
          break;
        case 'auth/invalid-email':
          errMsg = 'Invalid email format. Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errMsg = 'Password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/too-many-requests':
          errMsg = 'Too many failed login attempts. Access is temporarily disabled. Please try again in a few minutes.';
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