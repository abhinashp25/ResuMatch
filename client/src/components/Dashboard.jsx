import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';

// ─── SVG Icon Library ───
const Icon = {
  scan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  doc:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  mic:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  bag:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  arr:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  chart:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  empty:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Welcome');
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [docsCount, setDocsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchCounts = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const [docsRes, jobsRes] = await Promise.all([
          api.get('/api/documents', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/api/jobs', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        if (docsRes.data.success) setDocsCount(docsRes.data.data.length);
        if (jobsRes.data.success) setJobsCount(jobsRes.data.data.length);
      } catch (err) {
        console.error('Failed to load counts on dashboard:', err);
      }
    };

    if (user?.uid) {
      const saved = localStorage.getItem(`analyses_${user.uid}`);
      if (saved) {
        try { setRecentAnalyses(JSON.parse(saved)); } catch (e) { console.error(e); }
      }
      fetchCounts();
    }
  }, [user]);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const firstName = displayName.split(' ')[0];

  const totalAnalyzed = recentAnalyses.length;
  const avgScore = totalAnalyzed > 0
    ? Math.round(recentAnalyses.reduce((sum, r) => sum + r.matchScore, 0) / totalAnalyzed)
    : 0;
  const bestScore = totalAnalyzed > 0 ? Math.max(...recentAnalyses.map(r => r.matchScore)) : 0;

  const onboardingTasks = [
    { label: 'Scan Your Resume', done: totalAnalyzed > 0, tip: 'Go to the "Analyze Resume" page, upload your PDF resume and paste a job description.' },
    { label: 'Check Saved Resumes', done: docsCount > 0, tip: 'Your scanned resumes are automatically saved inside "My Documents".' },
    { label: 'Track Your First Job', done: jobsCount > 0, tip: 'Track matching scores and application stages in the "Job Tracker".' }
  ];

  const onboardingDone = onboardingTasks.filter(t => t.done).length;
  const onboardingPct = Math.round((onboardingDone / onboardingTasks.length) * 100);

  const stats = [
    { label: 'Average Match Score', value: totalAnalyzed > 0 ? `${avgScore}%` : '—', sub: totalAnalyzed > 0 ? `${totalAnalyzed} scans run` : 'No analyses yet', color: '#7c3aed', bg: 'rgba(124,58,237,0.07)', progress: avgScore, icon: Icon.chart },
    { label: 'Personal Best',        value: totalAnalyzed > 0 ? `${bestScore}%` : '—', sub: 'Highest score achieved', color: '#059669', bg: 'rgba(5,150,105,0.07)', progress: bestScore, icon: Icon.star },
    { label: 'Resumes Analyzed',     value: totalAnalyzed, sub: totalAnalyzed > 0 ? 'Keep iterating!' : 'Start your first scan', color: '#2563eb', bg: 'rgba(37,99,235,0.07)', progress: Math.min(totalAnalyzed * 10, 100), icon: Icon.doc },
  ];

  const tools = [
    { label: 'Analyze Resume',   desc: 'Match your resume against any job description with our multi-AI engine.',     icon: Icon.scan, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', path: '/app/analyzer',   primary: true },
    { label: 'My Documents',     desc: 'Manage resumes, cover letters, and tailored drafts in your secure vault.',     icon: Icon.doc,  color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  path: '/app/documents' },
    { label: 'Interview Prep',   desc: 'Practice STAR answers, study sample questions, and use the pacing timer.',     icon: Icon.mic,  color: '#059669', bg: 'rgba(5,150,105,0.08)',  path: '/app/interview' },
    { label: 'Job Tracker',      desc: 'Track every application stage from bookmarked to offer received.',             icon: Icon.bag,  color: '#d97706', bg: 'rgba(217,119,6,0.08)',  path: '/app/saved-jobs' },
    { label: 'Resume Examples',  desc: 'Browse vetted templates across 4 industries to inspire your next resume.',     icon: Icon.star, color: '#db2777', bg: 'rgba(219,39,119,0.08)', path: '/app/examples' },
  ];

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .dash { font-family: 'Inter', system-ui, sans-serif; }
        .tool-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 18px;
          padding: 24px;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          display: flex; flex-direction: column; gap: 14px;
        }
        .tool-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,0.08); }
        .stat-track { height: 3px; background: rgba(0,0,0,0.06); border-radius: 99px; margin-top: 14px; overflow: hidden; }
        .stat-fill  { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(.34,1.56,.64,1); }
        .score-pill { display:inline-block; padding: 3px 11px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; }
        .view-btn { background: transparent; border: 1px solid rgba(124,58,237,0.2); color: #7c3aed; padding: 5px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family:'Inter',system-ui,sans-serif; transition: all 0.18s; white-space: nowrap; }
        .view-btn:hover { background: rgba(124,58,237,0.08); }
        @media(max-width:768px){ .dash-stats { grid-template-columns:1fr!important; } .dash-tools { grid-template-columns:1fr!important; } }
      `}</style>

      <div className="dash">

        {/* ── Header ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:48 }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'1.8px', marginBottom:8 }}>
              {new Date().toLocaleDateString('en-IN',{ weekday:'long', month:'long', day:'numeric' })}
            </p>
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-1px', lineHeight:1.1, marginBottom:8 }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ color:'#64748b', fontSize:'0.95rem', maxWidth:460 }}>
              Your AI-powered career workspace. Land the interview, beat the ATS.
            </p>
          </div>
          <button
            onClick={() => navigate('/app/analyzer')}
            style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', border:'none', borderRadius:14, padding:'12px 22px', fontSize:'0.9rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(124,58,237,0.3)', whiteSpace:'nowrap', fontFamily:'Inter,system-ui,sans-serif' }}
          >
            {Icon.scan}&nbsp;New Analysis
          </button>
        </div>

        {/* ── Onboarding Guide for New Users ── */}
        {onboardingPct < 100 && (
          <div className="onboarding-card" style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(255,255,255,0.85) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}> Get Started Guide</h2>
                <p style={{ color: '#64748b', fontSize: '0.82rem' }}>Complete these 3 simple steps to start using the app.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed' }}>{onboardingDone}/3 Completed</span>
                <div style={{ width: '80px', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#7c3aed', width: `${onboardingPct}%`, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {onboardingTasks.map((task, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: task.done ? 'none' : '1.5px solid rgba(124, 58, 237, 0.4)',
                    background: task.done ? '#7c3aed' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {task.done ? '✓' : ''}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: task.done ? '#94a3b8' : '#0f172a', textDecoration: task.done ? 'line-through' : 'none', marginBottom: '4px' }}>
                      {task.label}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4' }}>{task.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="dash-stats" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:44 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.9)', borderRadius:20, padding:'26px 26px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <p style={{ fontSize:12, color:'#94a3b8', fontWeight:500, marginBottom:6 }}>{s.label}</p>
                  <div style={{ fontSize:'2rem', fontWeight:800, color:'#0f172a', letterSpacing:'-1px', lineHeight:1 }}>{s.value}</div>
                </div>
                <div style={{ width:40, height:40, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', color:s.color }}>
                  {s.icon}
                </div>
              </div>
              <p style={{ fontSize:'0.78rem', color:'#64748b' }}>{s.sub}</p>
              <div className="stat-track">
                <div className="stat-fill" style={{ width:`${s.progress}%`, background:s.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Tools ── */}
        <h2 style={{ fontSize:'1.05rem', fontWeight:700, color:'#0f172a', marginBottom:18, letterSpacing:'-0.3px' }}>
          Your Workspace
        </h2>
        <div className="dash-tools" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16, marginBottom:48 }}>
          {tools.map((t, i) => (
            <div key={i} className="tool-card" onClick={() => navigate(t.path)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ width:42, height:42, borderRadius:12, background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', color:t.color, flexShrink:0 }}>
                  {t.icon}
                </div>
                <span style={{ color:'#e2e8f0' }}>{Icon.arr}</span>
              </div>
              <div>
                <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#0f172a', marginBottom:5 }}>{t.label}</h3>
                <p style={{ fontSize:'0.82rem', color:'#64748b', lineHeight:1.55 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Activity ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h2 style={{ fontSize:'1.05rem', fontWeight:700, color:'#0f172a', letterSpacing:'-0.3px' }}>Recent Analyses</h2>
          {totalAnalyzed > 0 && (
            <button onClick={() => navigate('/app/analyzer')} style={{ background:'transparent', border:'none', color:'#7c3aed', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:'Inter,system-ui,sans-serif' }}>
              New Scan {Icon.arr}
            </button>
          )}
        </div>
        <div style={{ background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.9)', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,0.03)', padding:'0 0 4px' }}>
          {totalAnalyzed === 0 ? (
            <div style={{ textAlign:'center', padding:'56px 20px' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'rgba(124,58,237,0.07)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#7c3aed' }}>
                {Icon.empty}
              </div>
              <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#0f172a', marginBottom:6 }}>No analyses yet</h3>
              <p style={{ fontSize:'0.82rem', color:'#94a3b8', marginBottom:20 }}>Run your first resume scan to start tracking scores here.</p>
              <button onClick={() => navigate('/app/analyzer')} style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', border:'none', borderRadius:12, padding:'10px 22px', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                Analyze Your First Resume
              </button>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Resume File','Job Description','Match Score','Date',''].map((h, i) => (
                      <th key={i} style={{ padding:'14px 20px', fontSize:'0.72rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.8px', textAlign:'left', borderBottom:'1px solid rgba(0,0,0,0.05)', whiteSpace:'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentAnalyses.slice(0, 5).map((item, i) => {
                    const sc = item.matchScore;
                    const sc_color = sc >= 70 ? '#059669' : sc >= 40 ? '#d97706' : '#ef4444';
                    const sc_bg    = sc >= 70 ? 'rgba(5,150,105,0.1)' : sc >= 40 ? 'rgba(217,119,6,0.1)' : 'rgba(239,68,68,0.1)';
                    return (
                      <tr key={i}>
                        <td style={{ padding:'15px 20px', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:30, height:30, borderRadius:8, background:'rgba(124,58,237,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#7c3aed', flexShrink:0 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                            <span style={{ fontSize:'0.83rem', fontWeight:600, color:'#0f172a' }}>{item.filename}</span>
                          </div>
                        </td>
                        <td style={{ padding:'15px 20px', borderBottom:'1px solid rgba(0,0,0,0.04)', maxWidth:220 }}>
                          <span style={{ fontSize:'0.78rem', color:'#64748b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block' }}>
                            {item.jobDescSnippet}
                          </span>
                        </td>
                        <td style={{ padding:'15px 20px', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                          <span className="score-pill" style={{ background:sc_bg, color:sc_color }}>{sc}% Match</span>
                        </td>
                        <td style={{ padding:'15px 20px', borderBottom:'1px solid rgba(0,0,0,0.04)', fontSize:'0.78rem', color:'#94a3b8', whiteSpace:'nowrap' }}>
                          {new Date(item.timestamp).toLocaleDateString('en-IN',{ month:'short', day:'numeric', year:'numeric' })}
                        </td>
                        <td style={{ padding:'15px 20px', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                          <button className="view-btn" onClick={() => {
                            localStorage.setItem(`selected_result_${user.uid}`, JSON.stringify(item));
                            navigate('/app/analyzer');
                          }}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
