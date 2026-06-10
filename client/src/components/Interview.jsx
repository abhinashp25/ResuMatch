import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';

// ─── Circular Timer SVG ───
function CircleTimer({ timeLeft, total, color = '#7c3aed' }) {
  const r    = 68;
  const circ = 2 * Math.PI * r;
  const fill = total > 0 ? (timeLeft / total) * circ : 0;
  const pct  = total > 0 ? Math.round((timeLeft / total) * 100) : 0;

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ position:'relative', width:168, height:168, margin:'0 auto 20px' }}>
      <svg width="168" height="168" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="84" cy="84" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="9"/>
        <circle
          cx="84" cy="84" r={r} fill="none" stroke={timeLeft === 0 ? '#ef4444' : color}
          strokeWidth="9" strokeDasharray={circ} strokeDashoffset={circ - fill}
          strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.7s ease, stroke 0.3s' }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:'2.1rem', fontWeight:800, color: timeLeft === 0 ? '#ef4444' : '#0f172a', letterSpacing:'-1px', lineHeight:1 }}>
          {mins}:{secs}
        </span>
        <span style={{ fontSize:'0.7rem', color:'#94a3b8', marginTop:4, fontWeight:500 }}>
          {pct}% remaining
        </span>
      </div>
    </div>
  );
}

// ─── STAR card definitions ───
const STAR_CARDS = [
  { letter:'S', title:'Situation', color:'#7c3aed', bg:'rgba(124,58,237,0.07)', border:'rgba(124,58,237,0.12)', desc:'Set the scene. What project, team challenge, or professional moment were you in? Provide just enough background that the interviewer understands the stakes without drowning in details.' },
  { letter:'T', title:'Task',      color:'#2563eb', bg:'rgba(37,99,235,0.07)',  border:'rgba(37,99,235,0.12)',  desc:"Clarify your personal responsibility. What was specifically expected of you? Distinguish your role from the team's and highlight any ownership or deadline pressure you were under." },
  { letter:'A', title:'Action',    color:'#059669', bg:'rgba(5,150,105,0.07)',  border:'rgba(5,150,105,0.12)',  desc:'This is the core of your answer — what YOU did. Use first-person language. Detail the specific decisions, methods, tools, or strategies you applied. Avoid saying "we did".' },
  { letter:'R', title:'Result',    color:'#d97706', bg:'rgba(217,119,6,0.07)',  border:'rgba(217,119,6,0.12)',  desc:"Quantify your impact wherever possible. 'Reduced load time by 40%' is far stronger than 'improved performance'. Connect outcomes to the business or team's goals." },
];

// ─── Sample questions with full guidance ───
const QUESTIONS = [
  {
    category: 'Behavioral',
    q: 'Tell me about a time you handled a difficult conflict on a team.',
    a: `Use STAR to structure this clearly:
• Situation: Briefly describe the team and what the conflict was about (priorities, personalities, deadlines).
• Task: Explain your responsibility — were you a contributor, or were you expected to mediate?
• Action: Detail the specific steps you took — did you initiate a 1:1, bring in data, propose a compromise?
• Result: What improved? Team velocity, morale, delivery date? Quantify if possible.
Tip: Avoid blaming others. Frame it as a shared challenge you helped solve.`,
  },
  {
    category: 'Technical',
    q: 'How do you approach performance optimization in a React application?',
    a: `Structure your answer with layers of depth:
• Component level: Identify unnecessary re-renders using React DevTools. Apply React.memo, useMemo, useCallback where warranted.
• Bundle level: Lazy-load heavy routes with React.lazy + Suspense. Analyze bundle sizes with tools like Webpack Bundle Analyzer.
• Network level: Optimize images (WebP, lazy loading), reduce API payload size, use CDN caching, and implement proper HTTP caching headers.
• State level: Avoid over-fetching by scoping state and normalizing your data store.
Tip: Pick 2–3 techniques and give a concrete example from a real project you worked on.`,
  },
  {
    category: 'Situational',
    q: 'How do you manage competing priorities when deadlines overlap?',
    a: `This is a test of your judgment and communication:
• Acknowledge: When deadlines clash, the first step is visibility — make the conflict clear to all stakeholders.
• Prioritize: Use an urgency-vs-impact matrix (Eisenhower-style) to rank tasks. Focus effort on high-impact, time-sensitive items.
• Communicate: Proactively alert the relevant parties about which task will be delayed and by how much.
• Document: Log your decisions so nothing falls through the cracks.
Tip: Use a real example from your past experience to make this concrete and credible.`,
  },
  {
    category: 'Culture & Fit',
    q: 'Why are you interested in this role and company?',
    a: `Research is everything here. A strong answer has three ingredients:
• Company mission alignment: Refer to something specific — a product, a recent initiative, or a company value that resonates with you personally.
• Role fit: Connect 2–3 of your strongest skills directly to what's listed in the job description.
• Growth: Mention what excites you about what you'd learn or build in this role.
Tip: Rehearse this answer, but never sound scripted. Genuine curiosity is more compelling than perfect delivery.`,
  },
];

export default function Interview() {
  const { user } = useAuth();
  const [timeLeft,      setTimeLeft]      = useState(120);
  const [timerTotal,    setTimerTotal]    = useState(120);
  const [isRunning,     setIsRunning]     = useState(false);
  const [openQ,         setOpenQ]         = useState(null);
  const [checklist,     setChecklist]     = useState([]);

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:5000/api/interview/checklist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setChecklist(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch checklist:', err);
      }
    };
    fetchChecklist();
  }, [user]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) { setIsRunning(false); return; }
    const id = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  const setPreset = (secs) => { setTimerTotal(secs); setTimeLeft(secs); setIsRunning(false); };
  const resetTimer = () => { setTimeLeft(timerTotal); setIsRunning(false); };

  const toggleCheck = async (id) => {
    const updatedList = checklist.map(i => i.id === id ? { ...i, done: !i.done } : i);
    setChecklist(updatedList);

    try {
      const token = await user.getIdToken();
      await axios.put('http://localhost:5000/api/interview/checklist', {
        items: updatedList
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to save checklist:', err);
      // Revert state if backend update fails
      setChecklist(checklist);
    }
  };

  const doneCount = checklist.length > 0 ? checklist.filter(c => c.done).length : 0;
  const readyPct  = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .interview-page { font-family:'Inter',system-ui,sans-serif; }
        .glass-panel {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
        }
        .star-card {
          border-radius: 16px; padding: 20px;
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
          cursor: default;
        }
        .star-card:hover { transform: translateY(-3px); }
        .q-card {
          border-radius: 16px; padding: 18px 20px;
          cursor: pointer;
          transition: background 0.18s;
          margin-bottom: 10px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 1px 6px rgba(0,0,0,0.03);
        }
        .q-card:hover { background: rgba(255,255,255,0.95); }
        .preset-btn {
          padding: 6px 14px; border-radius: 99px;
          font-size: 0.78rem; font-weight: 600; border: none; cursor: pointer;
          transition: all 0.18s; font-family:'Inter',system-ui,sans-serif;
        }
        .check-item {
          display: flex; align-items: flex-start; gap: 10;
          padding: 10px 0; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .check-item:last-child { border-bottom: none; }
        .custom-checkbox {
          width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
          border: 1.5px solid rgba(0,0,0,0.18); background: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s; margin-top: 1px;
        }
        .custom-checkbox.done { background: #7c3aed; border-color: #7c3aed; }
        @media(max-width:900px){ .interview-body { grid-template-columns:1fr!important; } .star-grid { grid-template-columns:repeat(2,1fr)!important; } }
        @media(max-width:500px){ .star-grid { grid-template-columns:1fr!important; } }
      `}</style>

      <div className="interview-page">

        {/* ── Header ── */}
        <div style={{ marginBottom:36 }}>
          <p style={{ fontSize:12, fontWeight:600, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'1.8px', marginBottom:8 }}>Interview Preparation</p>
          <h1 style={{ fontSize:'clamp(1.6rem,3.5vw,2.1rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.8px', marginBottom:6 }}>
            Prepare for Interview
          </h1>
          <p style={{ color:'#64748b', fontSize:'0.92rem', maxWidth:560 }}>
            Structure your answers with the STAR method, study sample questions, and practice your pacing with our built-in timer.
          </p>
        </div>

        {/* ── How It Works Steps ── */}
        <div className="glass-panel" style={{ padding:'28px 30px', marginBottom:36, background:'linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(255,255,255,0.75) 100%)' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#0f172a', marginBottom:20 }}>Your 3-Step Prep Plan</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {[
              { step:'01', title:'Align Your Resume',   color:'#7c3aed', bg:'rgba(124,58,237,0.08)', desc:'Run a resume scan in the Analyzer to identify which keywords the job requires and which gaps you need to fill.' },
              { step:'02', title:'Draft STAR Stories',  color:'#2563eb', bg:'rgba(37,99,235,0.08)',  desc:'Using the STAR framework below, write 3 strong behavioral stories covering leadership, conflict resolution, and delivery under pressure.' },
              { step:'03', title:'Practice Pacing',     color:'#059669', bg:'rgba(5,150,105,0.08)',  desc:"Use the timer on the right. Most great answers take 90 seconds. Practice until you can deliver yours confidently under 2 minutes." },
            ].map((s, i) => (
              <div key={i} style={{ padding:'18px 20px', borderRadius:14, background:s.bg, border:`1px solid ${s.bg}` }}>
                <div style={{ fontSize:'0.7rem', fontWeight:800, color:s.color, letterSpacing:'1px', marginBottom:8 }}>STEP {s.step}</div>
                <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#0f172a', marginBottom:6 }}>{s.title}</h3>
                <p style={{ fontSize:'0.8rem', color:'#64748b', lineHeight:1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── STAR Framework ── */}
        <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#0f172a', marginBottom:16 }}>The STAR Framework</h2>
        <div className="star-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:36 }}>
          {STAR_CARDS.map(c => (
            <div key={c.letter} className="star-card" style={{ background:c.bg, border:`1px solid ${c.border}` }}>
              <div style={{ fontSize:'1.8rem', fontWeight:900, color:c.color, lineHeight:1, marginBottom:8 }}>{c.letter}</div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#0f172a', marginBottom:6 }}>{c.title}</h3>
              <p style={{ fontSize:'0.78rem', color:'#64748b', lineHeight:1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Main two-column body ── */}
        <div className="interview-body" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>

          {/* Left: Sample Questions */}
          <div>
            <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#0f172a', marginBottom:16 }}>Sample Questions & Guidance</h2>
            {QUESTIONS.map((q, i) => (
              <div key={i} className="q-card" onClick={() => setOpenQ(openQ === i ? null : i)}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  <div>
                    <span style={{ fontSize:'0.68rem', fontWeight:700, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.6px', display:'block', marginBottom:4 }}>
                      {q.category}
                    </span>
                    <span style={{ fontSize:'0.88rem', fontWeight:600, color:'#0f172a', lineHeight:1.4, display:'block' }}>{q.q}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:3, transition:'transform 0.2s', transform: openQ === i ? 'rotate(180deg)' : 'none' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                {openQ === i && (
                  <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid rgba(0,0,0,0.05)' }}>
                    <pre style={{ margin:0, fontSize:'0.82rem', color:'#475569', lineHeight:1.7, fontFamily:'Inter,system-ui,sans-serif', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                      {q.a}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Practice Timer */}
            <div className="glass-panel" style={{ padding:'24px 20px', textAlign:'center' }}>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#0f172a', marginBottom:4 }}>Answer Timer</h3>
              <p style={{ fontSize:'0.75rem', color:'#94a3b8', marginBottom:20 }}>
                Aim for 90 seconds. Stop at 2 minutes.
              </p>

              <CircleTimer timeLeft={timeLeft} total={timerTotal} color={isRunning ? '#7c3aed' : '#94a3b8'} />

              {/* Presets */}
              <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:16 }}>
                {[{label:'1 min',secs:60},{label:'90 sec',secs:90},{label:'2 min',secs:120},{label:'3 min',secs:180}].map(p => (
                  <button key={p.secs} className="preset-btn" onClick={() => setPreset(p.secs)} style={{
                    background: timerTotal === p.secs ? 'rgba(124,58,237,0.1)' : 'rgba(0,0,0,0.04)',
                    color:      timerTotal === p.secs ? '#7c3aed' : '#64748b',
                    border:     timerTotal === p.secs ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div style={{ display:'flex', gap:10 }}>
                {isRunning ? (
                  <button onClick={() => setIsRunning(false)} style={{ flex:1, padding:'10px 0', borderRadius:11, border:'none', background:'rgba(245,158,11,0.1)', color:'#d97706', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                    Pause
                  </button>
                ) : (
                  <button onClick={() => setIsRunning(true)} disabled={timeLeft === 0} style={{ flex:2, padding:'10px 0', borderRadius:11, border:'none', background: timeLeft === 0 ? 'rgba(0,0,0,0.05)' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: timeLeft === 0 ? '#94a3b8' : '#fff', fontWeight:700, fontSize:'0.85rem', cursor: timeLeft === 0 ? 'default' : 'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                    {timeLeft === 0 ? 'Time Up' : 'Start'}
                  </button>
                )}
                <button onClick={resetTimer} style={{ flex:1, padding:'10px 0', borderRadius:11, border:'1px solid rgba(0,0,0,0.08)', background:'#fff', color:'#64748b', fontWeight:600, fontSize:'0.85rem', cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                  Reset
                </button>
              </div>
            </div>

            {/* Interview Readiness Checklist */}
            <div className="glass-panel" style={{ padding:'22px 20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#0f172a' }}>Readiness Checklist</h3>
                <span style={{ fontSize:'0.75rem', fontWeight:700, color: readyPct === 100 ? '#059669' : '#7c3aed' }}>
                  {doneCount}/{checklist.length} done
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height:4, background:'rgba(0,0,0,0.06)', borderRadius:99, marginBottom:16, overflow:'hidden' }}>
                <div style={{ height:'100%', background: readyPct === 100 ? '#059669' : '#7c3aed', borderRadius:99, width:`${readyPct}%`, transition:'width 0.5s cubic-bezier(.34,1.56,.64,1)' }} />
              </div>

              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {checklist.map(item => (
                  <li key={item.id} className="check-item" onClick={() => toggleCheck(item.id)}>
                    <div className={`custom-checkbox ${item.done ? 'done' : ''}`}>
                      {item.done && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize:'0.8rem', color: item.done ? '#94a3b8' : '#374151', textDecoration: item.done ? 'line-through' : 'none', lineHeight:1.5, userSelect:'none' }}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
