import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';

// ─── Kanban column definitions ───
const STAGES = [
  { key: 'bookmarked',  label: 'Saved',        color: '#64748b', bg: 'rgba(100,116,139,0.1)', dot: '#64748b' },
  { key: 'applied',     label: 'Applied',       color: '#2563eb', bg: 'rgba(37,99,235,0.1)',   dot: '#2563eb' },
  { key: 'interviewing',label: 'Interviewing',  color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', dot: '#7c3aed' },
  { key: 'offer',       label: 'Offer',         color: '#059669', bg: 'rgba(5,150,105,0.1)',   dot: '#059669' },
];

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);

// Generate a consistent color from a company name string
const PALETTE = ['#7c3aed','#2563eb','#059669','#d97706','#db2777','#0891b2','#dc2626'];
const companyColor = (name) => PALETTE[name.length % PALETTE.length];
const initials     = (name) => name.substring(0, 2).toUpperCase();

export default function SavedJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ role: '', company: '', score: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError('');
        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:5000/api/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setJobs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError('Could not load tracked jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  const handleAdd = async () => {
    if (!form.role.trim() || !form.company.trim()) return;
    try {
      const token = await user.getIdToken();
      const res = await axios.post('http://localhost:5000/api/jobs', {
        role: form.role.trim(),
        company: form.company.trim(),
        score: parseInt(form.score) || 75
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs([res.data.data, ...jobs]);
      }
    } catch (err) {
      console.error('Failed to add job:', err);
      alert('Failed to add job to tracker.');
    }
    setForm({ role: '', company: '', score: '' });
    setShowModal(false);
  };

  const moveJob = async (id, newStatus) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs(jobs.map(j => j._id === id ? { ...j, status: newStatus } : j));
      }
    } catch (err) {
      console.error('Failed to move job:', err);
      alert('Failed to move job card.');
    }
  };

  const deleteJob = async (id) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs(jobs.filter(j => j._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Failed to remove job card.');
    }
  };

  const totalApplied      = jobs.filter(j => j.status !== 'bookmarked').length;
  const totalInterviewing = jobs.filter(j => j.status === 'interviewing').length;
  const totalOffer        = jobs.filter(j => j.status === 'offer').length;

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .jobs-page { font-family:'Inter',system-ui,sans-serif; }
        .kanban-col {
          background: rgba(248,250,252,0.85);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 18px;
          min-height: 220px;
          overflow: hidden;
        }
        .job-card {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,1);
          border-radius: 13px;
          padding: 14px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
        }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
        .stage-move-btn {
          padding: 3px 9px; border-radius: 6px; font-size: 0.7rem;
          font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s; font-family:'Inter',system-ui,sans-serif;
          display: flex; align-items: center; gap: 3px;
        }
        .stage-move-btn:hover { opacity: 0.75; }
        .stat-chip {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,1);
          border-radius: 14px;
          padding: 16px 22px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          min-width: 120px;
          flex: 1;
        }
        .modal-overlay {
          position:fixed; inset:0; z-index:999;
          background:rgba(15,23,42,0.25); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
          display:flex; align-items:center; justify-content:center; padding:20px;
        }
        .modal-card {
          background:rgba(255,255,255,0.97); border:1px solid rgba(255,255,255,1);
          border-radius:24px; padding:34px; width:100%; max-width:400px;
          box-shadow:0 24px 80px rgba(0,0,0,0.14); font-family:'Inter',system-ui,sans-serif;
        }
        .modal-inp {
          width:100%; padding:11px 14px; border:1.5px solid rgba(0,0,0,0.09);
          border-radius:12px; font-size:0.88rem; outline:none;
          background:#f8fafc; font-family:'Inter',system-ui,sans-serif;
          transition:border-color 0.18s; box-sizing:border-box; margin-bottom:13px;
        }
        .modal-inp:focus { border-color:rgba(124,58,237,0.45); background:#fff; }
        @media(max-width:900px){ .kanban-board { grid-template-columns: repeat(2,1fr)!important; } }
        @media(max-width:600px){ .kanban-board { grid-template-columns: 1fr!important; } }
      `}</style>

      <div className="jobs-page">

        {/* ── Header ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:36 }}>
          <div>
            <h1 style={{ fontSize:'clamp(1.6rem,3.5vw,2.1rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.8px', marginBottom:6 }}>
              My Saved Jobs
            </h1>
            <p style={{ color:'#64748b', fontSize:'0.92rem' }}>
              Move cards across stages to track your application pipeline.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', border:'none', borderRadius:12, padding:'10px 20px', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:7, boxShadow:'0 4px 14px rgba(124,58,237,0.25)', fontFamily:'Inter,system-ui,sans-serif' }}
          >
            <PlusIcon /> Add Job
          </button>
        </div>

        {/* ── Quick Stats ── */}
        <div style={{ display:'flex', gap:14, marginBottom:32, flexWrap:'wrap' }}>
          {[
            { label:'Total Tracked',  value: jobs.length,      color:'#0f172a' },
            { label:'Active Pipeline',value: totalApplied,     color:'#2563eb' },
            { label:'Interviewing',   value: totalInterviewing, color:'#7c3aed' },
            { label:'Offers',         value: totalOffer,        color:'#059669' },
          ].map((s, i) => (
            <div key={i} className="stat-chip">
              <div style={{ fontSize:'1.7rem', fontWeight:800, color:s.color, letterSpacing:'-0.5px', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Loading / Error States & Kanban Board ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.75)', borderRadius: 20 }}>
            <p style={{ color: '#64748b', fontSize: '0.92rem' }}>Loading your job tracker pipeline...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.75)', borderRadius: 20 }}>
            <p style={{ color: '#ef4444', fontSize: '0.92rem', fontWeight: 600 }}>{error}</p>
          </div>
        ) : (
          <div className="kanban-board" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {STAGES.map(stage => {
              const stageJobs = jobs.filter(j => j.status === stage.key);
              const nextStages = STAGES.filter(s => s.key !== stage.key);
              return (
                <div key={stage.key} className="kanban-col">
                  {/* Column Header */}
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(0,0,0,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:stage.dot }} />
                      <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#0f172a' }}>{stage.label}</span>
                    </div>
                    <span style={{ background:stage.bg, color:stage.color, padding:'2px 8px', borderRadius:99, fontSize:'0.7rem', fontWeight:700 }}>
                      {stageJobs.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div style={{ padding:'10px', display:'flex', flexDirection:'column', gap:8 }}>
                    {stageJobs.length === 0 ? (
                      <div style={{ textAlign:'center', padding:'22px 8px', color:'#cbd5e1', fontSize:'0.75rem' }}>
                        Drop a job here
                      </div>
                    ) : (
                      stageJobs.map(job => (
                        <div key={job._id} className="job-card">
                          {/* Company avatar + role */}
                          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10 }}>
                            <div style={{ width:34, height:34, borderRadius:9, background:companyColor(job.company), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.7rem', fontWeight:800, flexShrink:0, letterSpacing:'0.5px' }}>
                              {initials(job.company)}
                            </div>
                            <div>
                              <div style={{ fontSize:'0.83rem', fontWeight:700, color:'#0f172a', lineHeight:1.25 }}>{job.role}</div>
                              <div style={{ fontSize:'0.72rem', color:'#64748b' }}>{job.company}</div>
                            </div>
                          </div>

                          {/* Score + date */}
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                            <span style={{ fontSize:'0.68rem', color:'#94a3b8' }}>
                              {new Date(job.date).toLocaleDateString('en-IN',{ month:'short', day:'numeric' })}
                            </span>
                            <span style={{
                              background: job.score >= 80 ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)',
                              color:      job.score >= 80 ? '#059669'               : '#d97706',
                              padding:'2px 8px', borderRadius:99, fontSize:'0.68rem', fontWeight:700
                            }}>
                              {job.score}% match
                            </span>
                          </div>

                          {/* Move to other stages */}
                          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:6 }}>
                            {nextStages.map(ns => (
                              <button key={ns.key} className="stage-move-btn" style={{ background:ns.bg, color:ns.color }} onClick={() => moveJob(job._id, ns.key)}>
                                <ChevronIcon /> {ns.label}
                              </button>
                            ))}
                          </div>

                          {/* Delete */}
                          <button onClick={() => deleteJob(job._id)} style={{ background:'transparent', border:'none', color:'#cbd5e1', cursor:'pointer', padding:0, fontSize:'0.7rem', display:'flex', alignItems:'center', gap:3, fontFamily:'Inter,system-ui,sans-serif', marginTop:2 }}>
                            <TrashIcon /> Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── Add Job Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:'#0f172a', marginBottom:4 }}>Track a New Job</h2>
            <p style={{ fontSize:'0.82rem', color:'#64748b', marginBottom:24 }}>It will be added to your Saved stage to start.</p>

            <label style={{ fontSize:'0.77rem', fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Job Title</label>
            <input className="modal-inp" placeholder="e.g. Frontend Developer" value={form.role} onChange={e => setForm({...form, role: e.target.value})} autoFocus />

            <label style={{ fontSize:'0.77rem', fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Company</label>
            <input className="modal-inp" placeholder="e.g. Google" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />

            <label style={{ fontSize:'0.77rem', fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>AI Match Score (optional)</label>
            <input className="modal-inp" placeholder="e.g. 82" type="number" min="0" max="100" value={form.score} onChange={e => setForm({...form, score: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleAdd()} style={{ marginBottom:26 }} />

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex:1, padding:11, borderRadius:12, border:'1.5px solid rgba(0,0,0,0.09)', background:'#fff', color:'#64748b', fontWeight:600, fontSize:'0.88rem', cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                Cancel
              </button>
              <button onClick={handleAdd} style={{ flex:2, padding:11, borderRadius:12, border:'none', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                Add to Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
