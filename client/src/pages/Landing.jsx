import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// ─── BLUR TEXT ───
const BlurText = ({ text, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });
  return (
    <p ref={ref} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '0.1em', ...style }}>
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

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onLight = scrollY > window.innerHeight * 1.85;

  return (
    <div style={{ background: '#000', color: '#fff', overflowX: 'hidden' }}>
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
            onClick={() => navigate('/')}
            style={{ color: onLight ? '#0f172a' : '#ffffff', transition: 'color 0.3s ease' }}
          >
            ResuMatch<span className="logo-dot">.</span>
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
          {['Home', 'How It Works', 'Features', 'Match Score', 'Pricing'].map((l, index) => (
            <span
              key={l}
              onMouseEnter={() => setHovered(index)}
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
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Full-cover background image — original proportions */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src="/Landing_page.png"
          alt="Background"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% center', zIndex: 0 }}
        />
        {/* Gradient overlay: left side darker for text, right lets image breathe */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', padding: '0 8%' }}>

          {/* HERO CONTENT — LEFT ALIGNED */}
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

          {/* BOTTOM: BUTTONS + STATS */}
          <motion.div {...fu} transition={{ ease: 'easeOut', delay: 1.0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingBottom: 48 }}>
            {/* CTA Buttons */}
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
                onClick={() => {}}
                style={{ borderRadius: 9999, padding: '11px 22px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow',sans-serif" }}
              >
                See How It Works <Play />
              </button>
            </div>

            {/* Compact Stat Pills */}
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

      {/* ══════════════ CAPABILITIES ══════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, #06060f 0%, #0d0a1e 40%, #060a14 100%)' }}>
        {/* Capabilities Background Image — original proportions */}
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="/Second.png"
          alt="Capabilities Background"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        {/* Subtle dark matching overlays to preserve original background image colors while maintaining readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.55) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 10, padding: '96px 64px 40px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
            <p className="text-glow" style={{ fontSize: 12, fontFamily: "'Barlow',sans-serif", color: 'rgba(255,255,255,0.55)', marginBottom: 20, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500 }}>Core Engine</p>
            <BlurText text="Analysis perfected" style={{ fontSize: 'clamp(2.0rem, 3.8vw, 3.2rem)', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.3px', justifyContent: 'flex-end', textShadow: '0 2px 12px rgba(0,0,0,0.5)', fontFamily: "'Barlow', sans-serif", fontWeight: 600, textAlign: 'right' }} />
          </div>

          <div className="caps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 64 }}>
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                ),
                tags: ['PDF Parsing', 'Text Extract', 'ATS Safe', 'Multi-format'],
                title: 'Resume Parsing',
                body: 'Deep semantic extraction from your PDF — pulling real content, not formatting noise — optimized for how modern ATS systems read documents.',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm3-4H7v-2h8v2zm3-4H7V7h11v2z"/>
                  </svg>
                ),
                tags: ['Groq LLaMA', 'Gemini Flash', 'GPT Fallback', 'Auto-Switch'],
                title: 'AI Match Scoring',
                body: 'Three AI models work in sequence. If one hits a rate limit, the next activates instantly. Your analysis never fails — it just switches engines.',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91v6.11h2V9L12 3z"/>
                  </svg>
                ),
                tags: ['Keyword Gap', 'Score 0-100', 'Suggestions', 'History Saved'],
                title: 'Actionable Output',
                body: 'Not just a number. Get missing keywords, ranked suggestions, and a match score saved to your history — track progress across every application.',
              },
            ].map((card, i) => (
              <div key={i} className="lq" style={{ borderRadius: 20, padding: '20px 22px', minHeight: 290, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)' }}>
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
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', paddingTop: 64 }}>
            <button className="lqs" onClick={() => navigate(user ? '/app' : '/auth')} style={{ borderRadius: 9999, padding: '14px 32px', fontSize: 16, fontWeight: 500, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow',sans-serif" }}>
              {user ? 'Go to Analyzer' : 'Start Analyzing Free'} <Arrow />
            </button>
          </div>
        </div>

        {/* Soft matching overlay at the bottom to fade the wood table/background into the white testimonials background */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(180deg, transparent 0%, #f8fafc 100%)', zIndex: 2 }} />
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="testimonials-section" style={{ paddingTop: 60 }}>
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

        <div className="marquee-container">
          {/* Row 1: Left moving */}
          <div className="marquee-row left">
            {[
              { name: 'Avery Johnson', handle: 'averywrites', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', text: 'ResuMatch made undercutting all of my competitors an absolute breeze. Got a 90% score and landed my interview at Google!' },
              { name: 'Briar Martin', handle: 'neilstellar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', text: 'The multi-model fallback feature saved me. My resume was not parsing elsewhere, but here it worked instantly.' },
              { name: 'Jordan Lee', handle: 'jordantalks', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face', text: 'Actionable suggestions are gold. Adding the exact keywords missing from my profile bumped my call-backs by 3x.' },
              { name: 'Morgan Davis', handle: 'morgancodes', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face', text: 'Super clean UI and blazing fast analysis. The liquid glass aesthetics make it a joy to use.' },
            ].concat([
              { name: 'Avery Johnson', handle: 'averywrites', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', text: 'ResuMatch made undercutting all of my competitors an absolute breeze. Got a 90% score and landed my interview at Google!' },
              { name: 'Briar Martin', handle: 'neilstellar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', text: 'The multi-model fallback feature saved me. My resume was not parsing elsewhere, but here it worked instantly.' },
              { name: 'Jordan Lee', handle: 'jordantalks', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face', text: 'Actionable suggestions are gold. Adding the exact keywords missing from my profile bumped my call-backs by 3x.' },
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

          {/* Row 2: Right moving */}
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
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}