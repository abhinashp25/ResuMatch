import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Welcome');
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  
  // Set personalized greeting
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good morning');
    } else if (hours < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    // Load recent analyses from localStorage
    const saved = localStorage.getItem('recent_analyses');
    if (saved) {
      try {
        setRecentAnalyses(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  // Stats calculation
  const totalAnalyzed = recentAnalyses.length;
  const avgScore = totalAnalyzed > 0 
    ? Math.round(recentAnalyses.reduce((acc, curr) => acc + curr.matchScore, 0) / totalAnalyzed) 
    : 0;

  const quickActions = [
    {
      title: 'Analyze Resume',
      desc: 'Scan your resume against any job description with advanced AI Auto-Fallback.',
      icon: '🔍',
      action: () => navigate('/app/analyzer'),
      primary: true
    },
    {
      title: 'My Documents',
      desc: 'Manage all your generated resumes, cover letters, and tailored drafts.',
      icon: '📄',
      action: () => navigate('/app/documents')
    },
    {
      title: 'Prepare for Interview',
      desc: 'Ace your next call with our STAR framework guides, common questions, and interactive prep timers.',
      icon: '🎙️',
      action: () => navigate('/app/interview')
    },
    {
      title: 'Job Tracker',
      desc: 'Track jobs, status updates, and application deadlines on a simple visual pipeline.',
      icon: '💼',
      action: () => navigate('/app/saved-jobs')
    },
    {
      title: 'Resume Examples',
      desc: 'Get inspired by industry-vetted resume templates across modern professional roles.',
      icon: '💡',
      action: () => navigate('/app/examples')
    }
  ];

  return (
    <AppLayout>
      <div className="dashboard-welcome">
        <h1>{greeting}, {displayName}! 👋</h1>
        <p>Your ultimate workspace to align your resume with top careers, track applications, and prep for success.</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="app-liquid-card">
          <div className="stat-card-value">{totalAnalyzed > 0 ? `${avgScore}%` : 'N/A'}</div>
          <div className="stat-card-label">Average Match Score</div>
        </div>
        <div className="app-liquid-card">
          <div className="stat-card-value">{totalAnalyzed}</div>
          <div className="stat-card-label">Resumes Analyzed</div>
        </div>
        <div className="app-liquid-card">
          <div className="stat-card-value">12</div>
          <div className="stat-card-label">Interview Prep Hours</div>
        </div>
      </div>

      <h2 className="dashboard-actions-title">Quick Actions & Tools</h2>
      <div className="dashboard-actions-grid" style={{ marginBottom: '40px' }}>
        {quickActions.map((item, idx) => (
          <div 
            key={idx} 
            className="app-liquid-card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: item.primary ? '1px solid rgba(124, 58, 237, 0.3)' : undefined
            }}
            onClick={item.action}
          >
            <div>
              <div className="action-card-icon">{item.icon}</div>
              <h3 className="action-card-title">{item.title}</h3>
              <p className="action-card-desc">{item.desc}</p>
            </div>
            <button className={`app-btn-liquid ${!item.primary ? 'app-btn-liquid-secondary' : ''}`} style={{ width: '100%' }}>
              Get Started
            </button>
          </div>
        ))}
      </div>

      <h2 className="dashboard-actions-title">Recent Activity</h2>
      <div className="app-liquid-card">
        {recentAnalyses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-light-muted)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>📁</span>
            <p>No recent resume analyses found. Try scanning a resume to see history here!</p>
            <button 
              className="app-btn-liquid" 
              style={{ marginTop: '14px' }}
              onClick={() => navigate('/app/analyzer')}
            >
              Analyze Your First Resume
            </button>
          </div>
        ) : (
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Resume Filename</th>
                  <th>Job/Description Snippet</th>
                  <th>Match Score</th>
                  <th>Date Analyzed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.slice(0, 5).map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="job-role">📄 {item.filename}</span>
                    </td>
                    <td>
                      <span className="job-company" style={{ display: 'block', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.jobDescSnippet}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${item.matchScore >= 70 ? 'offer' : item.matchScore >= 40 ? 'applied' : 'bookmarked'}`}>
                        {item.matchScore}% Match
                      </span>
                    </td>
                    <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="app-btn-liquid app-btn-liquid-secondary" 
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}
                        onClick={() => {
                          localStorage.setItem('selected_analysis_result', JSON.stringify(item));
                          navigate('/app/analyzer');
                        }}
                      >
                        View Details
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
