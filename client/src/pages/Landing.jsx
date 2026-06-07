import { useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── BLUR TEXT ───
const BlurText = ({ text, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });
  return (
    <p ref={ref} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '0.1em', ...style }}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '0.28em', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
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

  return (
    <div style={{ background: '#000', color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');
        .lq {
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.15);
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative; overflow: hidden;
        }
        .lqs {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.25);
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative; overflow: hidden;
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
      
      {/* NAV - Moved outside sections so it isn't clipped by scroll/stacking contexts */}
      <nav style={{ position: 'fixed', top: 16, left: 0, right: 0, padding: '0 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 9999 }}>
        <div className="lq" onClick={() => navigate('/')} style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 22, color: '#fff' }}>r</span>
        </div>

        <div className="lq nav-pill nav-center" style={{ borderRadius: 9999, padding: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          {['Home', 'How It Works', 'Features', 'Match Score', 'Pricing'].map(l => <span key={l}>{l}</span>)}
          <button onClick={() => navigate(user ? '/app' : '/auth')} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 9999, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Barlow',sans-serif", whiteSpace: 'nowrap' }}>
            Analyze Resume <Arrow size={16} />
          </button>
        </div>

        <div style={{ width: 48, height: 48 }} />
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="/Ai_resume_background.png"
          alt="Background"
          style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: '120%', height: '120%', objectFit: 'cover', objectPosition: 'top', zIndex: 0 }}
        />

        {/* Insert directly under your FadingVideo component to overlay a subtle, professional technical grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* HERO CONTENT */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 96, paddingLeft: 16, paddingRight: 16, textAlign: 'center' }}>

            <motion.div {...fu} transition={{ ease: 'easeOut', delay: 0.4 }} className="lq" style={{ borderRadius: 9999, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <span style={{ background: '#fff', color: '#000', borderRadius: 9999, padding: '4px 12px', fontSize: 12, fontWeight: 700, fontFamily: "'Barlow',sans-serif" }}>v1.0</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', paddingRight: 12, fontFamily: "'Barlow',sans-serif" }}>Multi-Model AI Resume Analysis Engine Now Live</span>
            </motion.div>

            <BlurText
              text="Score Your Resume Before the Recruiter Does"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: '#fff', lineHeight: 0.85, maxWidth: 750, letterSpacing: '-3px', margin: '0 auto', textShadow: '0 4px 16px rgba(0,0,0,0.8)' }}
            />

            <motion.p {...fu} transition={{ ease: 'easeOut', delay: 0.8 }} className="text-glow" style={{ marginTop: 16, fontSize: 16, color: '#fff', maxWidth: 540, fontWeight: 300, lineHeight: 1.6, fontFamily: "'Barlow',sans-serif" }}>
              Upload your resume, paste any job description, and get an instant AI match score with missing keywords and actionable suggestions — powered by Groq, Gemini and OpenAI.
            </motion.p>

            <motion.div {...fu} transition={{ ease: 'easeOut', delay: 1.1 }} style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="lqs" onClick={() => navigate(user ? '/app' : '/auth')} style={{ borderRadius: 9999, padding: '10px 20px', fontSize: 14, fontWeight: 500, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow',sans-serif" }}>
                {user ? 'Go to Analyzer' : 'Analyze with AI'} <Arrow />
              </button>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Barlow',sans-serif" }}>
                See How It Works <Play />
              </button>
            </motion.div>

            <motion.div {...fu} transition={{ ease: 'easeOut', delay: 1.3 }} className="stats-row" style={{ display: 'flex', alignItems: 'stretch', gap: 16, marginTop: 32 }}>
              {[
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M9 12l2 2 4-4"/><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>, num: '3 AI', label: 'Models with Auto-Fallback' },
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, num: '<10s', label: 'Average Analysis Time' },
              ].map((s, i) => (
                <div key={i} className="lq" style={{ borderRadius: 20, padding: 20, width: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 36, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>{s.num}</div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontWeight: 300 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* PARTNERS */}
          <motion.div {...fu} transition={{ ease: 'easeOut', delay: 1.4 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 32 }}>
            <div className="lq" style={{ borderRadius: 9999, padding: '4px 14px', fontSize: 12, fontWeight: 500, color: '#fff', fontFamily: "'Barlow',sans-serif" }}>
              Engineered to clear modern filters at industry leaders
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Microsoft', 'Google', 'Meta', 'Amazon', 'Apple'].map(n => (
                <span key={n} style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 24, color: '#fff' }}>{n}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CAPABILITIES ══════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="/Ai_resume_second.png"
          alt="Capabilities Background"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />

        <div style={{ position: 'relative', zIndex: 10, padding: '96px 64px 40px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ marginBottom: 'auto' }}>
            <p className="text-glow" style={{ fontSize: 14, fontFamily: "'Barlow',sans-serif", color: 'rgba(255,255,255,0.9)', marginBottom: 24, letterSpacing: 2 }}>// CORE ENGINE</p>
            <BlurText text="Analysis perfected" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#fff', lineHeight: 0.9, letterSpacing: '-3px', justifyContent: 'flex-start', textShadow: '0 4px 16px rgba(0,0,0,0.8)' }} />
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
              <div key={i} className="lq" style={{ borderRadius: 20, padding: 24, minHeight: 360, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div className="lq" style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{card.icon}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 6, maxWidth: '70%' }}>
                    {card.tags.map(t => <span key={t} className="lq" style={{ borderRadius: 9999, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.9)', fontFamily: "'Barlow',sans-serif", whiteSpace: 'nowrap' }}>{t}</span>)}
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', color: '#fff', fontSize: 32, lineHeight: 1, letterSpacing: '-1px' }}>{card.title}</h3>
                  <p style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.9)', fontFamily: "'Barlow',sans-serif", fontWeight: 300, lineHeight: 1.5, maxWidth: '32ch' }}>{card.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', paddingTop: 64 }}>
            <button className="lqs" onClick={() => navigate(user ? '/app' : '/auth')} style={{ borderRadius: 9999, padding: '14px 32px', fontSize: 16, fontWeight: 500, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow',sans-serif" }}>
              {user ? 'Go to Analyzer' : 'Start Analyzing Free'} <Arrow />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}