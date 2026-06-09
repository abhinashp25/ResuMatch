import { useState } from 'react';
import AppLayout from './AppLayout';

export default function ResumeExamples() {
  const [activeTab, setActiveTab] = useState('All');
  
  const examples = [
    { id: 1, title: 'Senior Software Engineer', industry: 'Tech', icon: '💻', desc: 'Optimized for high-scale backend, frontend, and full-stack positions with deep metric callouts.', comingSoon: false },
    { id: 2, title: 'Data Scientist / ML Engineer', industry: 'Tech', icon: '📊', desc: 'Focuses on analytical tools, ML frameworks, data pipeline models, and ROI statistics.', comingSoon: false },
    { id: 3, title: 'Corporate Finance Analyst', industry: 'Finance', icon: '📈', desc: 'Tailored for investment banking, valuation models, quantitative reports, and corporate portfolios.', comingSoon: false },
    { id: 4, title: 'Creative UI/UX Designer', industry: 'Creative', icon: '🎨', desc: 'Emphasizes wireframing, case studies, user psychology, visual tools, and interaction design.', comingSoon: false },
    { id: 5, title: 'Clinical Health Administrator', industry: 'Healthcare', icon: '🏥', desc: 'Highlighting hospital operations, patient relations, EHR systems, and regulatory standards.', comingSoon: false },
    { id: 6, title: 'Product Manager (SaaS)', industry: 'Tech', icon: '🚀', desc: 'Focus on lifecycle metrics, product roadmap definitions, cross-team sync, and agile delivery.', comingSoon: true },
    { id: 7, title: 'Investment Associate', industry: 'Finance', icon: '🪙', desc: 'Structured for private equity, venture capitals, deal flows, and research assessments.', comingSoon: true },
    { id: 8, title: 'Lead Content Strategist', industry: 'Creative', icon: '✍️', desc: 'Highlight content calendars, SEO stats, campaign reach, brand voice, and digital design.', comingSoon: true }
  ];

  const industries = ['All', 'Tech', 'Finance', 'Healthcare', 'Creative'];

  const filteredExamples = activeTab === 'All' 
    ? examples 
    : examples.filter(item => item.industry === activeTab);

  return (
    <AppLayout>
      <div className="examples-header">
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Resume Examples & Templates</h1>
        <p style={{ color: 'var(--text-light-muted)' }}>Explore proven, industry-standard resume structures tailored to bypass automated applicant tracking systems.</p>
      </div>

      <div className="docs-filters" style={{ marginBottom: '32px' }}>
        {industries.map(ind => (
          <button 
            key={ind} 
            className={`docs-filter-btn ${activeTab === ind ? 'active' : ''}`}
            onClick={() => setActiveTab(ind)}
          >
            {ind}
          </button>
        ))}
      </div>

      <div className="examples-grid">
        {filteredExamples.map(item => (
          <div key={item.id} className="app-liquid-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="example-card-preview">
                {item.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="example-industry">{item.industry}</span>
                {item.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
              </div>
              <h3 className="example-title">{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                {item.desc}
              </p>
            </div>

            <button 
              className={`app-btn-liquid ${item.comingSoon ? 'app-btn-liquid-secondary' : ''}`} 
              style={{ width: '100%' }}
              disabled={item.comingSoon}
              onClick={() => alert(`Downloading template for ${item.title}...`)}
            >
              {item.comingSoon ? 'Notify Me' : 'Use Template'}
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
