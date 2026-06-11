import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';

// ─── Icons ───
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const DocIcon = ({ color = '#7c3aed' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);
const LetterIcon = ({ color = '#2563eb' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export default function Documents() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType]   = useState('Resume');

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError('');
        const token = await user.getIdToken();
        const res = await api.get('/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setDocs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
        setError('Could not load documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const ext   = newType === 'Resume' ? '.pdf' : '.docx';
    const title = newTitle.trim().endsWith(ext) ? newTitle.trim() : `${newTitle.trim()}${ext}`;
    
    try {
      const token = await user.getIdToken();
      const res = await api.post('/api/documents', {
        title,
        type: newType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDocs([res.data.data, ...docs]);
      }
    } catch (err) {
      console.error('Failed to create document:', err);
      alert('Failed to create document.');
    }
    setNewTitle('');
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = await user.getIdToken();
      const res = await api.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDocs(docs.filter(d => d._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
      alert('Failed to delete document. Make sure you are authorized.');
    }
  };

  const filtered = filter === 'All' ? docs : docs.filter(d => d.type === filter);
  const counts   = { 
    All: docs.length, 
    Resume: docs.filter(d => d.type === 'Resume').length, 
    'Cover Letter': docs.filter(d => d.type === 'Cover Letter').length 
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .docs-page { font-family: 'Inter', system-ui, sans-serif; }
        .doc-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 18px;
          padding: 22px;
          display: flex; flex-direction: column; gap: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
        }
        .doc-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.07); }
        .doc-act-btn {
          flex: 1; padding: 8px 0; border-radius: 10px;
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          transition: all 0.15s; font-family: 'Inter',system-ui,sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .filter-btn {
          padding: 7px 16px; border-radius: 99px; font-size: 0.83rem; font-weight: 500;
          border: none; cursor: pointer; transition: all 0.18s;
          font-family: 'Inter',system-ui,sans-serif;
          display: flex; align-items: center; gap: 6px;
        }
        .modal-overlay {
          position:fixed; inset:0; z-index:999;
          background:rgba(15,23,42,0.25); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
          display:flex; align-items:center; justify-content:center; padding: 20px;
        }
        .modal-card {
          background:rgba(255,255,255,0.97); border:1px solid rgba(255,255,255,1);
          border-radius:24px; padding:36px; width:100%; max-width:420px;
          box-shadow:0 24px 80px rgba(0,0,0,0.14); font-family:'Inter',system-ui,sans-serif;
        }
        .modal-inp {
          width:100%; padding:11px 14px; border:1.5px solid rgba(0,0,0,0.09);
          border-radius:12px; font-size:0.88rem; outline:none;
          background:#f8fafc; font-family:'Inter',system-ui,sans-serif;
          transition:border-color 0.18s; box-sizing:border-box; margin-bottom:14px;
        }
        .modal-inp:focus { border-color:rgba(124,58,237,0.45); background:#fff; }
        .type-btn {
          flex:1; padding:10px; border-radius:11px;
          border: 1.5px solid rgba(0,0,0,0.09); cursor:pointer;
          font-size:0.85rem; font-weight:600; transition:all 0.15s;
          font-family:'Inter',system-ui,sans-serif;
        }
      `}</style>

      <div className="docs-page">

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:36 }}>
          <div>
            <h1 style={{ fontSize:'clamp(1.6rem,3.5vw,2.1rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.8px', marginBottom:6 }}>
              My Documents
            </h1>
            <p style={{ color:'#64748b', fontSize:'0.92rem' }}>
              Organize your resumes and cover letters in one secure place.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', border:'none', borderRadius:12, padding:'10px 20px', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:7, boxShadow:'0 4px 14px rgba(124,58,237,0.25)', fontFamily:'Inter,system-ui,sans-serif' }}
          >
            <PlusIcon /> New Document
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:28 }}>
          {['All','Resume','Cover Letter'].map(t => (
            <button
              key={t}
              className="filter-btn"
              onClick={() => setFilter(t)}
              style={{
                background: filter === t ? '#7c3aed' : 'rgba(0,0,0,0.04)',
                color:      filter === t ? '#fff'    : '#64748b',
                boxShadow:  filter === t ? '0 4px 12px rgba(124,58,237,0.22)' : 'none',
              }}
            >
              {t}
              <span style={{ background: filter === t ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.07)', borderRadius:99, padding:'1px 7px', fontSize:'0.72rem', fontWeight:700 }}>
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        {/* Loading / Error / Grid States */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.75)', borderRadius: 20 }}>
            <p style={{ color: '#64748b', fontSize: '0.92rem' }}>Loading your secure documents vault...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.75)', borderRadius: 20 }}>
            <p style={{ color: '#ef4444', fontSize: '0.92rem', fontWeight: 600 }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div style={{ textAlign:'center', padding:'80px 20px', background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderRadius:20, border:'1px solid rgba(255,255,255,0.9)' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'rgba(124,58,237,0.07)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', color:'#7c3aed' }}>
              <DocIcon />
            </div>
            <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#0f172a', marginBottom:6 }}>No documents found</h3>
            <p style={{ fontSize:'0.82rem', color:'#94a3b8', marginBottom:20 }}>Create a new document to get started.</p>
            <button onClick={() => setShowModal(true)} style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', border:'none', borderRadius:12, padding:'10px 22px', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
              Create Document
            </button>
          </div>
        ) : (
          /* Document Grid */
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:18 }}>
            {filtered.map(doc => {
              const isResume = doc.type === 'Resume';
              const accent   = isResume ? '#7c3aed' : '#2563eb';
              const accentBg = isResume ? 'rgba(124,58,237,0.08)' : 'rgba(37,99,235,0.08)';
              return (
                <div key={doc._id} className="doc-card">
                  {/* Top row */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:accentBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {isResume ? <DocIcon color={accent} /> : <LetterIcon color={accent} />}
                    </div>
                    <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'3px 10px', borderRadius:99, background:accentBg, color:accent, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                      {doc.type}
                    </span>
                  </div>

                  {/* Title & meta */}
                  <div>
                    <h3 style={{ fontSize:'0.88rem', fontWeight:700, color:'#0f172a', marginBottom:4, wordBreak:'break-all', lineHeight:1.4 }}>{doc.title}</h3>
                    <p style={{ fontSize:'0.75rem', color:'#94a3b8' }}>Last edited {doc.date} · {doc.size}</p>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button
                      className="doc-act-btn"
                      style={{ background:accentBg, color:accent, border:`1px solid ${accentBg}` }}
                      onClick={() => alert(`Opening ${doc.title}...`)}
                    >
                      <EditIcon /> Open
                    </button>
                    <button
                      className="doc-act-btn"
                      style={{ background:'rgba(239,68,68,0.06)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.1)' }}
                      onClick={() => handleDelete(doc._id)}
                    >
                      <TrashIcon /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:800, color:'#0f172a', marginBottom:4 }}>New Document</h2>
            <p style={{ fontSize:'0.83rem', color:'#64748b', marginBottom:24 }}>Give your document a name and choose its type.</p>

            <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Document Name</label>
            <input
              className="modal-inp"
              type="text"
              placeholder="e.g. Google_Resume_2026"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />

            <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#374151', display:'block', marginBottom:8 }}>Document Type</label>
            <div style={{ display:'flex', gap:10, marginBottom:28 }}>
              {['Resume','Cover Letter'].map(t => (
                <button
                  key={t}
                  className="type-btn"
                  onClick={() => setNewType(t)}
                  style={{
                    border: newType === t ? '1.5px solid #7c3aed' : '1.5px solid rgba(0,0,0,0.09)',
                    background: newType === t ? 'rgba(124,58,237,0.07)' : '#fff',
                    color: newType === t ? '#7c3aed' : '#64748b',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid rgba(0,0,0,0.09)', background:'#fff', color:'#64748b', fontWeight:600, fontSize:'0.88rem', cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                Cancel
              </button>
              <button onClick={handleCreate} style={{ flex:2, padding:12, borderRadius:12, border:'none', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif' }}>
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
