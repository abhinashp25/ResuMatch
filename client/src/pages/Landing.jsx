import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// ─── BLUR TEXT ───
const BlurText = ({ text, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });
  return (
    <p ref={ref} style={{ display: 'flex', flexWrap: 'wrap', rowGap: '0.1em', ...style }}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={isInView ? { filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'], opacity: [0, 0.5, 1], y: [50, -5, 0] } : {}}
          transition={{ duration: 0.7, delay: (i * 100) / 1000, ease: 'easeOut', times: [0, 0.5, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

// ─── ICONS ───
const Arrow = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);
const Play = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
);

const fu = { initial: { filter: 'blur(10px)', opacity: 0, y: 20 }, animate: { filter: 'blur(0px)', opacity: 1, y: 0 } };

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hovered, setHovered] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  // Section Refs for smooth scrolling
  const homeRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);

  const handleNavClick = (label) => {
    if (label === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (label === 'How It Works') {
      howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (label === 'Features') {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (label === 'Testimonials') {
      testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (label === 'Pricing') {
      pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onLight = scrollY > window.innerHeight * 1.85;

  // Stagger Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const cards = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      ),
      tags: ['Step 1', 'Upload PDF', 'ATS Safe', 'Text Extract'],
      title: '1. Resume Parsing & Read',
      body: 'Simply drop your PDF resume into our secure portal. Our parser pulls semantic text while bypassing structural graphics, assessing it exactly like modern ATS systems do, checking for hidden filters.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm3-4H7v-2h8v2zm3-4H7V7h11v2z"/>
        </svg>
      ),
      tags: ['Step 2', 'Paste Job Desc', 'Multi-AI Model', 'Auto Fallback'],
      title: '2. Multi-Model AI Score Matching',
      body: 'Paste the target job description to match with your resume. Our multi-engine sequence uses Groq LLaMA, Gemini, and GPT. If one model hits throttle limit, the next picks up automatically to ensure an error-free analysis.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91v6.11h2V9L12 3z"/>
        </svg>
      ),
      tags: ['Step 3', 'Get Suggestions', 'Keyword Gaps', 'Saves to History'],
      title: '3. Optimize & Track Results',
      body: 'Obtain your precise match score alongside a list of missing ATS gap keywords. We provide ranked optimization suggestions and save the result to your personal Dashboard history to track improvements.',
    },
  ];

  return (
    <div id="home" ref={homeRef} style={{ background: '#000', color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600;700;800&display=swap');
        .lq {
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          position: relative; overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lq:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px -1px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.25);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .lqs {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.25);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          position: relative; overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lqs:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.35);
          border-color: rgba(255, 255, 255, 0.35);
        }
        .text-glow {
          text-shadow: 0 2px 14px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6);
        }
        .nav-pill span { padding: 8px 12px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.9); cursor: pointer; font-family: 'Barlow', sans-serif; text-shadow: 0 1px 4px rgba(0,0,0,0.8); }
        .nav-pill span:hover { color: #fff; text-shadow: 0 2px 8px rgba(255,255,255,0.4); }
        
        .price-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .price-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
          border-color: rgba(124, 58, 237, 0.22) !important;
        }

        .price-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }
        .price-btn-secondary:hover {
          background: rgba(124, 58, 237, 0.06) !important;
          transform: translateY(-2px);
        }

        @media(max-width:768px){
          .nav-center{display:none!important;}
          .caps-grid{grid-template-columns:1fr!important;}
          .stats-row{flex-direction:column!important;}
        }
      `}</style>
      
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '0 64px',
        height: onLight ? 64 : 76,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 9999,
        background: onLight ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: onLight ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: onLight ? 'blur(20px)' : 'none',
        borderBottom: onLight ? '1px solid rgba(15,23,42,0.07)' : 'none',
        transition: 'background 0.35s ease, height 0.35s ease, border 0.35s ease',
      }}>
        <div style={{ minWidth: 140 }}>
          <div
            className="nav-logo"
            onClick={() => handleNavClick('Home')}
            style={{ 
              color: onLight ? '#0f172a' : '#ffffff', 
              transition: 'color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <img src="/App_logo.png" alt="ResuMatch Logo" style={{ height: '32px', width: 'auto' }} />
            <span>ResuMatch<span className="logo-dot">.</span></span>
          </div>
        </div>

        <div
          className="nav-center"
          style={{
            borderRadius: 9999, padding: 6,
            display: 'flex', alignItems: 'center', gap: 4, position: 'relative',
            background: onLight ? 'rgba(15,23,42,0.04)' : 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: onLight ? '1px solid rgba(15,23,42,0.08)' : '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s ease',
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {['Home', 'How It Works', 'Features', 'Testimonials', 'Pricing'].map((l, index) => (
            <span
              key={l}
              onMouseEnter={() => setHovered(index)}
              onClick={() => handleNavClick(l)}
              style={{
                position: 'relative', padding: '8px 16px', fontSize: 14, fontWeight: 500,
                color: onLight
                  ? (hovered === index ? '#0f172a' : '#64748b')
                  : (hovered === index ? '#fff' : 'rgba(255,255,255,0.75)'),
                cursor: 'pointer', fontFamily: "'Barlow', sans-serif", zIndex: 2,
                transition: 'color 0.2s ease',
              }}
            >
              {l}
              {hovered === index && (
                <motion.div
                  layoutId="nav-hover-pill"
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 9999, zIndex: -1,
                    background: onLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </span>
          ))}
          <button
            onClick={() => navigate(user ? '/app' : '/auth')}
            style={{
              background: onLight ? '#0f172a' : '#fff',
              color: onLight ? '#fff' : '#000',
              border: 'none', borderRadius: 9999,
              padding: '8px 18px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: "'Barlow',sans-serif", whiteSpace: 'nowrap',
              position: 'relative', zIndex: 2, transition: 'all 0.3s ease',
            }}
          >
            Analyze Resume <Arrow size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 140, justifyContent: 'flex-end' }}>
          {user ? (
            <div onClick={() => navigate('/app')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=7c3aed&color=fff`}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}
                alt="avatar"
              />
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="btn-signin-glass"
              style={onLight ? {
                background: 'transparent',
                border: '1.5px solid rgba(15,23,42,0.18)',
                color: '#0f172a',
                boxShadow: 'none',
              } : {}}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#040307 radial-gradient(circle at 70% center, #1b1530 0%, #030206 100%)' }}>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src="/Landing_page.png"
          alt="Background"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% center', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', padding: '0 8%' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80, maxWidth: 620 }}>
            <motion.div {...fu} transition={{ ease: 'easeOut', delay: 0.4 }} className="lq" style={{ borderRadius: 9999, padding: '5px 14px', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <span style={{ background: '#fff', color: '#000', borderRadius: 9999, padding: '3px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'Barlow',sans-serif" }}>v1.0</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', paddingRight: 8, fontFamily: "'Barlow',sans-serif" }}>Multi-Model AI Resume Analysis Engine Now Live</span>
            </motion.div>

            <BlurText
              text="Score Your Resume Before the Recruiter Does"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', color: '#fff', lineHeight: 1.12, letterSpacing: '-0.3px', textShadow: '0 2px 16px rgba(0,0,0,0.6)', fontFamily: "'Barlow', sans-serif", fontWeight: 600, textAlign: 'left', justifyContent: 'flex-start' }}
            />

            <motion.p {...fu} transition={{ ease: 'easeOut', delay: 0.8 }} style={{ marginTop: 16, fontSize: 15, color: 'rgba(255,255,255,0.82)', maxWidth: 480, fontWeight: 300, lineHeight: 1.65, fontFamily: "'Barlow',sans-serif", textAlign: 'left' }}>
              Upload your resume, paste any job description, and get an instant AI match score with missing keywords and actionable suggestions — powered by Groq, Gemini and OpenAI.
            </motion.p>
          </div>

          <motion.div {...fu} transition={{ ease: 'easeOut', delay: 1.0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="lqs"
                onClick={() => navigate(user ? '/app' : '/auth')}
                style={{ borderRadius: 9999, padding: '11px 24px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow',sans-serif" }}
              >
                {user ? 'Go to Analyzer' : 'Analyze with AI'} <Arrow />
              </button>
              <button
                className="lq"
                onClick={() => handleNavClick('How It Works')}
                style={{ borderRadius: 9999, padding: '11px 22px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow',sans-serif" }}
              >
                See How It Works <Play />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"><path d="M9 12l2 2 4-4"/><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>, num: '3 AI', label: 'Models with Auto-Fallback' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, num: '<10s', label: 'Average Analysis Time' },
              ].map((s, i) => (
                <div key={i} className="lq" style={{ borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {s.icon}
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3, fontWeight: 300 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CAPABILITIES (HOW IT WORKS) ══════════════ */}
      <section id="how-it-works" ref={howItWorksRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, #06060f 0%, #0d0a1e 40%, #060a14 100%)' }}>
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src="/Second.png"
          alt="Capabilities Background"
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.55) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 10, padding: '96px 64px 40px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}
          >
            <p className="text-glow" style={{ fontSize: 12, fontFamily: "'Barlow',sans-serif", color: 'rgba(255,255,255,0.55)', marginBottom: 20, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500 }}>Core Engine</p>
            <BlurText text="Analysis perfected" style={{ fontSize: 'clamp(2.0rem, 3.8vw, 3.2rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.3px', justifyContent: 'flex-end', textShadow: '0 2px 12px rgba(0,0,0,0.5)', fontFamily: "'Barlow', sans-serif", fontWeight: 600, textAlign: 'right' }} />
          </motion.div>

          <motion.div 
            className="caps-grid" 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 64 }}
          >
            {cards.map((card, i) => (
              <motion.div 
                variants={itemVariants}
                key={i} 
                className="lq" 
                style={{ borderRadius: 20, padding: '20px 22px', minHeight: 290, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div className="lq" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{card.icon}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 4, maxWidth: '75%' }}>
                    {card.tags.map(t => <span key={t} className="lq" style={{ borderRadius: 9999, padding: '3px 10px', fontSize: 9.5, color: 'rgba(255,255,255,0.9)', fontFamily: "'Barlow',sans-serif", whiteSpace: 'nowrap' }}>{t}</span>)}
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#fff', fontSize: 21, lineHeight: 1.15, letterSpacing: '-0.3px' }}>{card.title}</h3>
                  <p style={{ marginTop: 8, fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontFamily: "'Barlow',sans-serif", fontWeight: 300, lineHeight: 1.45, maxWidth: '100%' }}>{card.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'center', paddingTop: 64 }}
          >
            <button className="lqs" onClick={() => navigate(user ? '/app' : '/auth')} style={{ borderRadius: 9999, padding: '14px 32px', fontSize: 16, fontWeight: 500, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow',sans-serif" }}>
              {user ? 'Go to Analyzer' : 'Start Analyzing Free'} <Arrow />
            </button>
          </motion.div>
        </div>

        {/* Transition overlay to blend with the white Features section background */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(180deg, transparent 0%, #ffffff 100%)', zIndex: 2 }} />
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" ref={featuresRef} style={{ position: 'relative', background: '#ffffff', color: '#0f172a', padding: '96px 64px 60px', zIndex: 10 }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', zIndex: 10, position: 'relative', marginBottom: 60 }}
        >
          <div style={{ display: 'inline-flex', borderRadius: 9999, padding: '6px 16px', color: '#7c3aed', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', fontSize: 12, fontWeight: 700, fontFamily: "'Barlow', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
            ✦ Platform Features
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#0f172a', fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Designed for Modern Job Hunting
          </h2>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}>
            Everything you need to beat ATS filters, master your mock interviews, and land your dream offer.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}
        >
          {[
            { img: '/search_logo.avif', title: 'AI Resume Analyzer', desc: 'Scan and grade your resume against target job listings using multiple model autothrottling and fallback systems.' },
            { img: '/job_logo.jpg', title: 'Saved Jobs Tracker', desc: 'Track job applications, interview timelines, status updates, and scores on a simple visual table pipeline.' },
            { img: '/mic_logo.jpg', title: 'STAR Interview Guide', desc: 'Structure your behavioral answers beautifully using the Situation, Task, Action, Result framework.' },
            { img: '/Timer_logo.avif', title: 'Practice Pacing Timer', desc: 'Practice mock answers under 2 minutes with our built-in interactive stopwatch countdown timer.' },
            { img: '/document_logo.webp', title: 'Documents Safe Vault', desc: 'Keep all your customized resume drafts, cover letters, and documents organized in a clean card layout.' }
          ].map((feat, i) => (
            <motion.div 
              variants={itemVariants}
              key={i} 
              className="price-card-hover" 
              style={{ 
                borderRadius: 20, 
                padding: 30, 
                display: 'flex', 
                flexDirection: 'column', 
                background: '#ffffff', 
                border: '1px solid rgba(15,23,42,0.08)', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ marginBottom: 20, width: 48, height: 48, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                <img src={feat.img} alt={feat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: '#0f172a', fontSize: 20, marginBottom: 10 }}>{feat.title}</h3>
              <p style={{ fontSize: 14, color: '#475569', fontFamily: "'Barlow',sans-serif", fontWeight: 400, lineHeight: 1.5 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── UPCOMING FEATURES ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ maxWidth: 1200, margin: '64px auto 0', position: 'relative', zIndex: 10 }}
        >
          <div style={{ borderRadius: 24, padding: '40px 48px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.04) 0%, rgba(255, 255, 255, 0.6) 100%)', border: '1px solid rgba(124, 58, 237, 0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, color: '#0f172a', fontSize: '1.5rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/Coming_logo.avif" alt="Coming Soon" style={{ width: 32, height: 32, borderRadius: '8px', objectFit: 'cover' }} />
               Next-Gen Roadmap (Coming Soon)
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: 24, fontFamily: "'Barlow',sans-serif" }}>
              We are constantly updating ResuMatch with state-of-the-art tools. Here is what we are building right now:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {[
                { title: 'Interactive AI Mock Interviews', desc: 'Engage in voice-to-voice mock conversations with a simulated recruiter that analyzes your tone, content, and STAR alignment.' },
                { title: 'AI-Powered Resume Builder', desc: 'Create beautiful, ATS-optimized templates from scratch with inline AI autocomplete, keyword suggestions, and drag-and-drop sections.' },
                { title: 'Auto Cover Letter Tailoring', desc: 'Generate high-conversion cover letters specifically tailored to the matching gap keywords of your target job description.' }
              ].map((up, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.4)', padding: 20, borderRadius: 16, border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h4 style={{ color: '#7c3aed', fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{up.title}</h4>
                  <p style={{ fontSize: 13, color: '#475569', fontFamily: "'Barlow',sans-serif", fontWeight: 400, lineHeight: 1.45 }}>{up.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg, transparent 0%, #f8fafc 100%)', zIndex: 2 }} />
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <motion.section 
        id="testimonials" 
        ref={testimonialsRef} 
        className="testimonials-section" 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        style={{ paddingTop: 60, background: '#f8fafc' }}
      >
        <div style={{ textAlign: 'center', padding: '0 24px', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', borderRadius: 9999, padding: '6px 16px', color: '#7c3aed', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', fontSize: 12, fontWeight: 700, fontFamily: "'Barlow', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
            ✦ Testimonials
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#0f172a', fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Don't just take our words
          </h2>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}>
            Hear what our users say about us. We're always looking for ways to improve. If you have a positive experience with us, leave a review.
          </p>
        </div>

        <div className="marquee-container" style={{ maskImage: 'linear-gradient(to right, transparent, #f8fafc 12%, #f8fafc 88%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #f8fafc 12%, #f8fafc 88%, transparent)' }}>
          <div className="marquee-row left">
            {[
              { name: 'Avery Johnson', handle: 'averywrites', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', text: 'ResuMatch made undercutting all of my competitors an absolute breeze. Got a 90% score and landed my interview at Google!' },
              { name: 'Briar Martin', handle: 'neilstellar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', text: 'The multi-model fallback feature saved me. My resume was not parsing elsewhere, but here it worked instantly.' },
              { name: 'Jordan Lee', handle: 'jordantalks', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face', text: 'Actionable suggestions are gold. Adding the exact keywords missing from my profile bumped my call-backs by 3x.' },
              { name: 'Morgan Davis', handle: 'morgancodes', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face', text: 'Super clean UI and blazing fast analysis. The liquid glass aesthetics make it a joy to use.' },
            ].concat([
              { name: 'Avery Johnson', handle: 'averywrites', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', text: 'ResuMatch made undercutting all of my competitors an absolute breeze. Got a 90% score and landed my interview at Google!' },
              { name: 'Briar Martin', handle: 'neilstellar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', text: 'The multi-model fallback feature saved me. My resume was not parsing elsewhere, but here it worked instantly.' },
              { name: 'Jordan Lee', handle: 'jordantalks', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face', text: 'Jordan made editing simple and structural improvements visible instantly.' },
              { name: 'Morgan Davis', handle: 'morgancodes', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face', text: 'Super clean UI and blazing fast analysis. The liquid glass aesthetics make it a joy to use.' },
            ]).map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-user">
                  <img
                    src={t.avatar}
                    className="testimonial-avatar"
                    alt={t.name}
                    onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=7c3aed&color=fff`; }}
                  />
                  <div className="testimonial-user-info">
                    <span className="testimonial-name">
                      {t.name}
                      <span className="testimonial-verified">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </span>
                    </span>
                    <span className="testimonial-handle">@{t.handle}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>

          <div className="marquee-row right">
            {[
              { name: 'Taylor Smith', handle: 'taylordesign', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face', text: 'I love the detailed keyword gap analysis. It felt like having a personal resume coach beside me.' },
              { name: 'Alex Rivera', handle: 'alexdev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', text: 'Saved my history and allowed me to track matching improvements over time. Simply brilliant.' },
              { name: 'Sam Wilson', handle: 'sambuilds', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', text: 'From a 45% match score to an 85% match score. Got the offer last week! Highly recommend ResuMatch.' },
              { name: 'Casey Jones', handle: 'caseyops', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', text: 'The ATS compatibility checking is top tier. Understood exactly what keywords were missing.' },
            ].concat([
              { name: 'Taylor Smith', handle: 'taylordesign', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face', text: 'I love the detailed keyword gap analysis. It felt like having a personal resume coach beside me.' },
              { name: 'Alex Rivera', handle: 'alexdev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', text: 'Saved my history and allowed me to track matching improvements over time. Simply brilliant.' },
              { name: 'Sam Wilson', handle: 'sambuilds', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', text: 'From a 45% match score to an 85% match score. Got the offer last week! Highly recommend ResuMatch.' },
              { name: 'Casey Jones', handle: 'caseyops', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', text: 'The ATS compatibility checking is top tier. Understood exactly what keywords were missing.' },
            ]).map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-user">
                  <img
                    src={t.avatar}
                    className="testimonial-avatar"
                    alt={t.name}
                    onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=2563eb&color=fff`; }}
                  />
                  <div className="testimonial-user-info">
                    <span className="testimonial-name">
                      {t.name}
                      <span className="testimonial-verified">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </span>
                    </span>
                    <span className="testimonial-handle">@{t.handle}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ width: '100%', height: 80, background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }} />
      </motion.section>

      {/* ══════════════ PRICING ══════════════ */}
      <section id="pricing" ref={pricingRef} style={{ position: 'relative', background: '#ffffff', color: '#0f172a', padding: '96px 64px 96px', zIndex: 10 }}>
        <div style={{ position: 'absolute', top: '30%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', zIndex: 10, position: 'relative', marginBottom: 60 }}
        >
          <div style={{ display: 'inline-flex', borderRadius: 9999, padding: '6px 16px', color: '#7c3aed', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', fontSize: 12, fontWeight: 700, fontFamily: "'Barlow', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
            ✦ Affordable Plans
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#0f172a', fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Ready to Clear ATS Filters?
          </h2>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}>
            Select the tier that aligns with your active job search. Start for free, upgrade when you need to fly.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}
        >
          {/* Plan 1 */}
          <motion.div 
            variants={itemVariants}
            className="price-card-hover" 
            style={{ borderRadius: 24, padding: 40, width: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', fontFamily: "'Barlow',sans-serif" }}>Basic</h3>
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Barlow',sans-serif" }}>₹0</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}> / month</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, fontFamily: "'Barlow',sans-serif", lineHeight: 1.4 }}>Perfect for occasional updates and baseline screening.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
                {['3 AI Resume scans / month', 'Standard ATS matching', 'Save up to 5 jobs in tracker', 'Basic suggestions'].map((f, idx) => (
                  <li key={idx} style={{ fontSize: 13.5, color: '#334155', fontFamily: "'Barlow',sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/auth')} 
              style={{ 
                width: '100%', 
                borderRadius: 12, 
                padding: 12, 
                border: '1.5px solid #7c3aed', 
                color: '#7c3aed', 
                background: 'transparent',
                fontWeight: 600, 
                cursor: 'pointer', 
                marginTop: 32, 
                fontFamily: "'Barlow',sans-serif",
                transition: 'all 0.2s'
              }}
              className="price-btn-secondary"
            >
              Get Started Free
            </button>
          </motion.div>

          {/* Plan 2 */}
          <motion.div 
            variants={itemVariants}
            className="price-card-hover" 
            style={{ borderRadius: 24, padding: 40, width: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff', border: '2px solid #7c3aed', boxShadow: '0 8px 32px rgba(124, 58, 237, 0.08)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', fontFamily: "'Barlow',sans-serif" }}>Pro</h3>
                <span style={{ background: '#7c3aed', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1 }}>Best Value</span>
              </div>
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Barlow',sans-serif" }}>₹399</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}> / month</span>
              </div>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 24, fontFamily: "'Barlow',sans-serif", lineHeight: 1.4 }}>Ideal for active job hunters aiming to land fast interviews.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
                {['Unlimited AI Resume scans', 'Advanced auto-fallback engine', 'Unlimited job pipeline tracker', 'STAR prep guide & Timer access', 'AI Cover Letter generation', 'Priority 5-second queue'].map((f, idx) => (
                  <li key={idx} style={{ fontSize: 13.5, color: '#1e293b', fontFamily: "'Barlow',sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/auth')} 
              style={{ 
                width: '100%', 
                borderRadius: 12, 
                padding: 14, 
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', 
                border: 'none', 
                color: '#fff', 
                fontWeight: 700, 
                cursor: 'pointer', 
                marginTop: 32, 
                fontFamily: "'Barlow',sans-serif", 
                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.2s'
              }}
              className="price-btn-primary"
            >
              Upgrade to Pro
            </button>
          </motion.div>

          {/* Plan 3 */}
          <motion.div 
            variants={itemVariants}
            className="price-card-hover" 
            style={{ borderRadius: 24, padding: 40, width: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', fontFamily: "'Barlow',sans-serif" }}>Elite</h3>
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Barlow',sans-serif" }}>₹799</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}> / month</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, fontFamily: "'Barlow',sans-serif", lineHeight: 1.4 }}>For candidates requiring maximum support and AI mock tutoring.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
                {['Everything in Pro plan', 'All resume templates unlocked', 'AI Voice Mock Interview prep', 'Dedicated success reports', 'Priority VIP 24/7 assistance'].map((f, idx) => (
                  <li key={idx} style={{ fontSize: 13.5, color: '#334155', fontFamily: "'Barlow',sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/auth')} 
              style={{ 
                width: '100%', 
                borderRadius: 12, 
                padding: 12, 
                border: '1.5px solid #7c3aed', 
                color: '#7c3aed', 
                background: 'transparent',
                fontWeight: 600, 
                cursor: 'pointer', 
                marginTop: 32, 
                fontFamily: "'Barlow',sans-serif",
                transition: 'all 0.2s'
              }}
              className="price-btn-secondary"
            >
              Unlock Elite
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}