import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/app');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
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
      {/* Background images with cross-fade transition */}
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
      
      {/* Dark overlay to balance readability */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'radial-gradient(circle, rgba(2,2,5,0.3) 0%, rgba(2,2,5,0.85) 100%)', 
          zIndex: 1 
        }} 
      />

      <div className="auth-card liquid-glass">
        <div className="auth-logo" onClick={() => navigate('/')}>
          ResuMatch<span className="logo-dot">.</span>
        </div>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-sub">
          {isLogin ? 'Sign in to analyze your resume' : 'Start for free — no credit card needed'}
        </p>

        <div className="auth-toggle" style={{ position: 'relative', zIndex: 10 }}>
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Sign In</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="auth-input"
          style={{ position: 'relative', zIndex: 10 }}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="auth-input"
          style={{ position: 'relative', zIndex: 10 }}
          onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
        />

        {error && <p className="error" style={{ position: 'relative', zIndex: 10 }}>{error}</p>}

        <button className="btn-primary w-full" onClick={handleEmailAuth} disabled={loading} style={{ position: 'relative', zIndex: 10 }}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <div className="divider" style={{ position: 'relative', zIndex: 10 }}><span>or</span></div>

        <button className="btn-google" onClick={handleGoogle} disabled={loading} style={{ position: 'relative', zIndex: 10 }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}