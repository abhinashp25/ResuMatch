import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';

export default function Analyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user?.uid) return;
    const savedResult = localStorage.getItem(`selected_result_${user.uid}`);
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setJobDesc(parsed.jobDescSnippet || '');
        setResult({
          matchScore:       parsed.matchScore,
          missingKeywords:  parsed.missingKeywords  || [],
          suggestions:      parsed.suggestions      || [],
          jobTitle:         parsed.jobTitle         || '',
        });
        // Restore company recommendations so they show up on "View"
        setCompanies(parsed.recommendedCompanies || []);
        localStorage.removeItem(`selected_result_${user.uid}`);
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!file || !jobDesc) {
      setError('Please upload a resume and enter a job description');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Fetch Firebase ID token from current logged in user
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDesc);

      const res = await api.post('/api/analyze', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = res.data.data;
      setResult(data);
      setCompanies(data.recommendedCompanies || []);

      // Save to this user's private history in localStorage
      // Include companies + jobTitle so Dashboard "View" can restore the full result
      const storageKey = `analyses_${user.uid}`;
      const newAnalysis = {
        id:                   Date.now(),
        filename:             file.name,
        jobDescSnippet:       jobDesc.slice(0, 100),
        matchScore:           data.matchScore,
        jobTitle:             data.jobTitle             || '',
        missingKeywords:      data.missingKeywords      || [],
        suggestions:          data.suggestions          || [],
        recommendedCompanies: data.recommendedCompanies || [],
        timestamp:            new Date().toISOString(),
      };
      const saved = localStorage.getItem(storageKey);
      const analyses = saved ? JSON.parse(saved) : [];
      localStorage.setItem(storageKey, JSON.stringify([newAnalysis, ...analyses].slice(0, 50)));
    } catch (err) {
      if (err.response) {
        if (err.response.status === 429) {
          setError(err.response.data.message || '⚠️ Too many requests. Please wait a minute before trying again.');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Analysis failed. The server rejected the request.');
        }
      } else {
        setError('Analysis failed. Check if server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Track a company application in Saved Jobs so it appears with the real name
  const trackJobApplication = async (company) => {
    if (!user || !result) return;
    try {
      const token = await user.getIdToken();
      await api.post('/api/jobs', {
        role:    result.jobTitle || 'Software Engineer',
        company: company.name,
        score:   result.matchScore || 0,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setToast(`${company.name} added to Saved Jobs!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Failed to track job:', err);
    }
  };

  return (
    <AppLayout>
      <div className="analyzer-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 0 40px' }}>
        <div className="analyzer-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Resume Analyzer</h1>
          <p style={{ color: 'var(--text-light-muted)' }}>Upload your resume and paste a job description to get your AI match score</p>
          {result && (
            <button
              onClick={() => navigate('/app')}
              style={{
                marginTop: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: '1px solid rgba(124,58,237,0.25)',
                color: '#7c3aed',
                borderRadius: 9999,
                padding: '8px 18px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(124,58,237,0.07)'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            >
              ← Back to Dashboard
            </button>
          )}
        </div>

        <div className="analyzer-grid" style={{ marginBottom: '32px' }}>
          <div className="app-liquid-card">
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '14px', fontSize: '0.95rem' }}>📄 Upload Resume (PDF)</label>
            <div className="upload-zone" onClick={() => document.getElementById('fileInput').click()} style={{ background: 'rgba(255, 255, 255, 0.4)', borderColor: 'rgba(124, 58, 237, 0.2)' }}>
              {file ? (
                <div className="file-selected">
                  <span>✅</span>
                  <span>{file.name}</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">⬆️</span>
                  <span>Click to upload PDF</span>
                  <span className="upload-hint">Max 10MB</span>
                </div>
              )}
            </div>
            <input
              id="fileInput" type="file" accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="app-liquid-card">
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '14px', fontSize: '0.95rem' }}>💼 Job Description</label>
            <textarea
              rows={8}
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="analyzer-textarea"
              style={{ background: 'rgba(255, 255, 255, 0.4)', color: 'var(--text-light-dark)', borderColor: 'rgba(124, 58, 237, 0.2)' }}
            />
          </div>
        </div>

        <button className="app-btn-liquid" onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '1rem', marginBottom: '32px' }}>
          {loading ? <><span className="spinner"></span>Analyzing with AI...</> : '🔍 Analyze Resume'}
        </button>

        {error && <p className="error" style={{ textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>{error}</p>}

        {result && (
          <div className="result-section" style={{ marginTop: '32px' }}>
            <div className="app-liquid-card score-card" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p className="score-label" style={{ color: 'var(--text-light-muted)', marginBottom: '16px' }}>Match Score</p>
              <div className={`score-circle ${result.matchScore >= 70 ? 'high' : result.matchScore >= 40 ? 'mid' : 'low'}`}>
                {result.matchScore}%
              </div>
              <p className="score-status" style={{ fontSize: '1rem', fontWeight: 600 }}>
                {result.matchScore >= 70 ? '🟢 Strong Match' : result.matchScore >= 40 ? '🟡 Moderate Match' : '🔴 Needs Work'}
              </p>
            </div>

            <div className="result-grid">
              <div className="app-liquid-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>🔍 Missing Keywords</h3>
                <div className="tags">
                  {result.missingKeywords && result.missingKeywords.length > 0 ? (
                    result.missingKeywords.map((kw, i) => (
                      <span key={i} className="tag">{kw}</span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-light-muted)', fontSize: '0.9rem' }}>No missing keywords identified! Excellent match.</span>
                  )}
                </div>
              </div>
              <div className="app-liquid-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>💡 Suggestions</h3>
                <ul className="suggestions-list" style={{ paddingLeft: '20px', margin: 0 }}>
                  {result.suggestions && result.suggestions.length > 0 ? (
                    result.suggestions.map((s, i) => (
                      <li key={i} style={{ color: 'var(--text-light-muted)', fontSize: '0.9rem', marginBottom: '8px', lineHeight: 1.5 }}>{s}</li>
                    ))
                  ) : (
                    <li style={{ color: 'var(--text-light-muted)', fontSize: '0.9rem' }}>No suggestions needed. Your resume is fully aligned.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Company Recommendations ── */}
        {companies.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'clamp(1.2rem,3vw,1.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                🏢 Companies Hiring for Your Profile
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.55 }}>
                Based on your resume score — <strong>Apply Now</strong> opens the real careers page,
                <strong> Prep Interview</strong> generates AI-powered company-specific questions.
                Both actions auto-save the company to your <strong>Saved Jobs</strong> tracker.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))',
              gap: 16,
            }}>
              {companies.map(company => {
                const isTopTier = company.tier === 1;
                const tierLabel = isTopTier ? '🏆 Top Tier' : '⭐ Great Fit';
                const tierColor = isTopTier ? '#7c3aed' : '#0369a1';
                const tierBg    = isTopTier ? 'rgba(124,58,237,0.08)' : 'rgba(3,105,161,0.08)';

                return (
                  <div
                    key={company.id}
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.9)',
                      borderRadius: 20,
                      padding: '22px 20px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                  >
                    {/* Header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12,
                        background: company.bgColor || '#F3F4F6',
                        border: `2px solid ${company.color}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: company.logo.length > 2 ? '0.65rem' : '1rem',
                        fontWeight: 900, color: company.color, flexShrink: 0,
                        letterSpacing: '-0.5px',
                      }}>
                        {company.logo}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {company.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                          {company.industry} · {company.hq}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 700, color: tierColor,
                        background: tierBg, padding: '3px 10px', borderRadius: 99,
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {tierLabel}
                      </span>
                    </div>

                    {/* Interview process */}
                    <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      {company.process}
                    </p>

                    {/* Focus areas */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {company.focus.slice(0, 4).map(f => (
                        <span key={f} style={{
                          fontSize: '0.68rem', fontWeight: 600,
                          background: 'rgba(0,0,0,0.04)', color: '#475569',
                          padding: '3px 9px', borderRadius: 99,
                        }}>{f}</span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <a
                        href={company.careers}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackJobApplication(company)}
                        style={{
                          flex: 1, textAlign: 'center', padding: '9px 0',
                          borderRadius: 10, fontSize: '0.8rem', fontWeight: 700,
                          background: company.color, color: '#fff',
                          textDecoration: 'none', transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        Apply Now ↗
                      </a>
                      <button
                        onClick={() => {
                          trackJobApplication(company);
                          const role  = encodeURIComponent(result.jobTitle || 'Software Engineer');
                          const comp  = encodeURIComponent(company.name);
                          const focus = encodeURIComponent(company.focus.join(','));
                          navigate(`/app/interview?company=${comp}&role=${role}&skills=${focus}`);
                        }}
                        style={{
                          flex: 1, padding: '9px 0', borderRadius: 10,
                          fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                          background: 'transparent',
                          border: `1.5px solid ${company.color}55`,
                          color: company.color, transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = `${company.bgColor || '#F3F4F6'}`}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Prep Interview
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg,#0f172a,#1e293b)',
          color: '#fff', borderRadius: 14, padding: '13px 26px',
          fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)', zIndex: 9999,
          animation: 'slideUp 0.3s cubic-bezier(.34,1.56,.64,1)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (max-width: 640px) {
          .analyzer-container { padding: 0 4px 40px !important; }
          .analyzer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppLayout>
  );
}
