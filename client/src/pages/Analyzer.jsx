import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Analyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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
      setResult(res.data.data);
    } catch (err) {
      setError('Analysis failed. Check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('/')}>ResuMatch</div>
        <div className="nav-user">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=7c3aed&color=fff`}
            className="avatar" alt="avatar"
          />
          <span className="user-email">{user?.displayName || user?.email}</span>
          <button className="btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="analyzer-container">
        <div className="analyzer-header">
          <h1>Resume Analyzer</h1>
          <p>Upload your resume and paste a job description to get your AI match score</p>
        </div>

        <div className="analyzer-grid">
          <div className="glass-card">
            <label>📄 Upload Resume (PDF)</label>
            <div className="upload-zone" onClick={() => document.getElementById('fileInput').click()}>
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

          <div className="glass-card">
            <label>💼 Job Description</label>
            <textarea
              rows={8}
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="analyzer-textarea"
            />
          </div>
        </div>

        <button className="btn-primary btn-large btn-analyze" onClick={handleSubmit} disabled={loading}>
          {loading ? <><span className="spinner"></span>Analyzing with AI...</> : '🔍 Analyze Resume'}
        </button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-section">
            <div className="glass-card score-card">
              <p className="score-label">Match Score</p>
              <div className={`score-circle ${result.matchScore >= 70 ? 'high' : result.matchScore >= 40 ? 'mid' : 'low'}`}>
                {result.matchScore}%
              </div>
              <p className="score-status">
                {result.matchScore >= 70 ? '🟢 Strong Match' : result.matchScore >= 40 ? '🟡 Moderate Match' : '🔴 Needs Work'}
              </p>
            </div>

            <div className="result-grid">
              <div className="glass-card">
                <h3>🔍 Missing Keywords</h3>
                <div className="tags">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="tag">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card">
                <h3>💡 Suggestions</h3>
                <ul className="suggestions-list">
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}