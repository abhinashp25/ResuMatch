import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';

export default function Analyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const savedResult = localStorage.getItem('selected_analysis_result');
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setJobDesc(parsed.jobDescSnippet || '');
        setResult({
          matchScore: parsed.matchScore,
          missingKeywords: parsed.missingKeywords || [],
          suggestions: parsed.suggestions || []
        });
        localStorage.removeItem('selected_analysis_result');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!file || !jobDesc) {
      setError('Please upload a resume and enter a job description');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDesc);
    try {
      const res = await axios.post('http://localhost:5000/api/analyze', formData);
      const data = res.data.data;
      setResult(data);

      // Save to history in localStorage
      const newAnalysis = {
        id: Date.now(),
        filename: file.name,
        jobDescSnippet: jobDesc.slice(0, 100),
        matchScore: data.matchScore,
        missingKeywords: data.missingKeywords || [],
        suggestions: data.suggestions || [],
        timestamp: new Date().toISOString()
      };
      const saved = localStorage.getItem('recent_analyses');
      const analyses = saved ? JSON.parse(saved) : [];
      localStorage.setItem('recent_analyses', JSON.stringify([newAnalysis, ...analyses]));
    } catch (err) {
      setError('Analysis failed. Check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="analyzer-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 0 40px' }}>
        <div className="analyzer-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Resume Analyzer</h1>
          <p style={{ color: 'var(--text-light-muted)' }}>Upload your resume and paste a job description to get your AI match score</p>
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
      </div>
    </AppLayout>
  );
}