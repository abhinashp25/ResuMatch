import { useState, useEffect } from 'react';
import AppLayout from './AppLayout';

export default function Interview() {
  // Timer State
  const [timeLeft, setTimeLeft] = useState(120); // default 2 minutes
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState(120);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Research the company background, mission, and products.', checked: false },
    { id: 2, text: 'Analyze the job description and match your resume keywords.', checked: true },
    { id: 3, text: 'Prepare 3 STAR stories matching core behavioral themes.', checked: false },
    { id: 4, text: 'Test your mic, camera, lighting, and internet setup.', checked: false },
    { id: 5, text: 'Prepare 3 thoughtful questions to ask the interviewer.', checked: false }
  ]);

  // Handle timer ticks
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleStartTimer = () => setTimerRunning(true);
  const handlePauseTimer = () => setTimerRunning(false);
  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerPreset);
  };
  const handleSetPreset = (seconds) => {
    setTimerPreset(seconds);
    setTimeLeft(seconds);
    setTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const faqs = [
    {
      id: 1,
      category: 'Behavioral Questions',
      question: 'Tell me about a time you handled a difficult project conflict.',
      answer: 'Use the STAR method: Define the situation where the team had conflicting goals, the task you needed to finish, the specific collaborative action you took to align everyone (e.g. data analysis or structured meetings), and the successful result (e.g. delivered 2 weeks early, team cohesion improved).'
    },
    {
      id: 2,
      category: 'Technical Questions',
      question: 'How do you optimize React applications for performance?',
      answer: 'Explain strategies such as: lazy loading components with React.lazy/Suspense, code splitting, memoizing expensive computations (useMemo, useCallback), optimizing image assets, minimizing render sizes, and auditing bundle sizes using tools like Webpack Bundle Analyzer.'
    },
    {
      id: 3,
      category: 'Cultural Fit & Situational',
      question: 'Why do you want to work at ResuMatch?',
      answer: 'Show that you researched the product. Focus on our mission: helping thousands of job seekers optimize their resumes using state-of-the-art AI. Explain how your skills in React/Web development align with building high-impact tools that solve real human challenges.'
    }
  ];

  return (
    <AppLayout>
      <div className="interview-header">
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Prepare for Interview</h1>
        <p style={{ color: 'var(--text-light-muted)' }}>Master your stories, structure responses using the STAR method, and practice with our interactive timer.</p>
      </div>

      <div className="app-liquid-card interview-hero">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>🎙️ Get Interview Ready in Minutes</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-light-muted)', marginBottom: '20px', maxWidth: '800px' }}>
          Interviews are won through preparation and structure. Use our step-by-step framework to analyze the position, draft behavioral answers, and practice pacing yourself under pressure.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.4)', borderRadius: 16 }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✅ Step 1</div>
            <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Align Resume</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>Scan with Resume Analyzer to find core requirements.</p>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.4)', borderRadius: 16 }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>💡 Step 2</div>
            <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Draft STAR Stories</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>Write structure-backed responses using bullet points.</p>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.4)', borderRadius: 16 }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⏰ Step 3</div>
            <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Practice Pacing</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>Deliver answers under 2 minutes using our practice timer.</p>
          </div>
        </div>
      </div>

      <div className="interview-grid">
        <div>
          {/* STAR Framework Section */}
          <div className="app-liquid-card star-section">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>⭐ The STAR Framework</h3>
            <p style={{ color: 'var(--text-light-muted)', lineHeight: 1.6 }}>
              The STAR method is a structured technique for responding to behavioral interview questions. It keeps your stories cohesive, data-driven, and focused on your contributions.
            </p>
            <div className="star-grid">
              <div style={{ background: 'rgba(124, 58, 237, 0.04)', padding: 16, borderRadius: 16, border: '1px solid rgba(124, 58, 237, 0.08)' }}>
                <div className="star-letter">S</div>
                <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Situation</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>Set the context. What project, team, or challenge were you facing?</p>
              </div>
              <div style={{ background: 'rgba(124, 58, 237, 0.04)', padding: 16, borderRadius: 16, border: '1px solid rgba(124, 58, 237, 0.08)' }}>
                <div className="star-letter">T</div>
                <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Task</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>Explain the goal. What was your specific responsibility in this situation?</p>
              </div>
              <div style={{ background: 'rgba(124, 58, 237, 0.04)', padding: 16, borderRadius: 16, border: '1px solid rgba(124, 58, 237, 0.08)' }}>
                <div className="star-letter">A</div>
                <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Action</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>Detail your steps. How did you resolve it? Highlight your engineering choices.</p>
              </div>
              <div style={{ background: 'rgba(124, 58, 237, 0.04)', padding: 16, borderRadius: 16, border: '1px solid rgba(124, 58, 237, 0.08)' }}>
                <div className="star-letter">R</div>
                <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Result</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>Deliver data. What was the positive business outcome or metric?</p>
              </div>
            </div>
          </div>

          {/* Interactive QA Section */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-light-dark)' }}>💡 Sample Questions & Answers</h3>
          <div style={{ marginBottom: 40 }}>
            {faqs.map(faq => (
              <div 
                key={faq.id} 
                className="app-liquid-card faq-card"
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              >
                <div className="faq-question">
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-light-theme)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                      {faq.category}
                    </span>
                    <span style={{ color: 'var(--text-light-dark)' }}>{faq.question}</span>
                  </div>
                  <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: openFaq === faq.id ? 'rotate(180deg)' : 'none' }}>
                    ▼
                  </span>
                </div>
                {openFaq === faq.id && (
                  <div className="faq-answer">
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Timer & Checklist */}
        <div>
          {/* Practice Timer */}
          <div className="app-liquid-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, textAlign: 'center' }}>⏰ Answer Pacing Timer</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light-muted)', textAlign: 'center', marginTop: 4 }}>
              Try to keep your answers between 1 to 2 minutes for maximum engagement.
            </p>
            <div className="timer-digits">{formatTime(timeLeft)}</div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
              <button 
                onClick={() => handleSetPreset(60)} 
                className={`docs-filter-btn ${timerPreset === 60 ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                1 Min
              </button>
              <button 
                onClick={() => handleSetPreset(120)} 
                className={`docs-filter-btn ${timerPreset === 120 ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                2 Min
              </button>
              <button 
                onClick={() => handleSetPreset(180)} 
                className={`docs-filter-btn ${timerPreset === 180 ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                3 Min
              </button>
            </div>

            <div className="timer-controls">
              {timerRunning ? (
                <button className="app-btn-liquid" onClick={handlePauseTimer} style={{ background: '#f59e0b', boxShadow: 'none' }}>
                  Pause
                </button>
              ) : (
                <button className="app-btn-liquid" onClick={handleStartTimer}>
                  Start Practice
                </button>
              )}
              <button className="app-btn-liquid app-btn-liquid-secondary" onClick={handleResetTimer}>
                Reset
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div className="app-liquid-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>📝 Interview Checklist</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0 }}>
              {checklist.map(item => (
                <li 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 10, 
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                  onClick={() => toggleChecklist(item.id)}
                >
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => {}} // handled by click on li
                    style={{ marginTop: 2, cursor: 'pointer' }}
                  />
                  <span style={{ 
                    textDecoration: item.checked ? 'line-through' : 'none', 
                    color: item.checked ? 'var(--text-light-muted)' : 'var(--text-light-dark)' 
                  }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
