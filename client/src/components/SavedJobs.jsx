import { useState } from 'react';
import AppLayout from './AppLayout';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([
    { id: 1, role: 'Frontend Developer', company: 'Google', status: 'interviewing', date: '2026-06-02', score: 85, resume: 'Abhinash_Resume_Tech.pdf' },
    { id: 2, role: 'Software Engineer', company: 'Meta', status: 'applied', date: '2026-06-04', score: 78, resume: 'Abhinash_Resume_Tech.pdf' },
    { id: 3, role: 'React Engineer', company: 'Netflix', status: 'bookmarked', date: '2026-06-06', score: 92, resume: 'Abhinash_Resume_General.pdf' },
    { id: 4, role: 'UI Engineer', company: 'Stripe', status: 'offer', date: '2026-05-20', score: 89, resume: 'Abhinash_Resume_Tech.pdf' }
  ]);

  const handleAddJob = () => {
    const role = prompt('Enter Job Title / Role:');
    if (!role) return;
    const company = prompt('Enter Company Name:');
    if (!company) return;
    const scoreString = prompt('Enter Match Score (e.g. 85) or leave blank:');
    const score = scoreString ? parseInt(scoreString) || 75 : 75;

    const newJob = {
      id: Date.now(),
      role,
      company,
      status: 'bookmarked',
      date: new Date().toISOString().split('T')[0],
      score,
      resume: 'Abhinash_Resume_Tech.pdf'
    };
    setJobs([newJob, ...jobs]);
  };

  const handleStatusChange = (id, newStatus) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
  };

  const handleDeleteJob = (id) => {
    if (confirm('Are you sure you want to remove this job from tracking?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="jobs-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Saved Jobs</h1>
          <p style={{ color: 'var(--text-light-muted)' }}>Track application stages, align custom resumes, and keep your interview schedule organized.</p>
        </div>
        <button className="app-btn-liquid" onClick={handleAddJob}>
          <span>+</span> New Job Application
        </button>
      </div>

      <div className="app-liquid-card">
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light-muted)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '20px' }}>💼</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No tracked jobs yet</h3>
            <p>Add your first job to start tracking interview pipelines.</p>
            <button className="app-btn-liquid" style={{ marginTop: '16px' }} onClick={handleAddJob}>
              Add Job Application
            </button>
          </div>
        ) : (
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Role & Company</th>
                  <th>Status</th>
                  <th>Date Tracked</th>
                  <th>AI Match Score</th>
                  <th>Resume Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="job-role">{job.role}</div>
                      <div className="job-company">{job.company}</div>
                    </td>
                    <td>
                      <select 
                        value={job.status} 
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          border: '1px solid rgba(0,0,0,0.1)', 
                          background: 'rgba(255,255,255,0.8)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="bookmarked">📌 Bookmarked</option>
                        <option value="applied">✉️ Applied</option>
                        <option value="interviewing">🎙️ Interviewing</option>
                        <option value="offer">🎉 Offer Received</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--text-light-muted)' }}>
                      {new Date(job.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`status-pill ${job.score >= 80 ? 'offer' : job.score >= 60 ? 'applied' : 'bookmarked'}`}>
                        {job.score}% Match
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--primary-light-theme)', fontWeight: 500 }}>
                      📄 {job.resume}
                    </td>
                    <td>
                      <button 
                        className="app-btn-logout" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
