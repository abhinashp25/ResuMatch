import { useState } from 'react';
import AppLayout from './AppLayout';

// ─── Template data ───
const TEMPLATES = [
  {
    id: 1,
    title:    'Senior Software Engineer',
    industry: 'Tech',
    level:    'Senior',
    color1:   '#7c3aed', color2: '#4f46e5',
    tags:     ['Full-Stack','Backend','APIs'],
    desc:     'Optimized for high-scale engineering roles. Highlights system design, architecture decisions, performance metrics, and cross-team ownership.',
    tips:     ['Lead with a technical impact summary','Quantify scale — users, requests, uptime %','List languages and frameworks per project'],
    ready:    true,
  },
  {
    id: 2,
    title:    'Data Scientist / ML Engineer',
    industry: 'Tech',
    level:    'Mid',
    color1:   '#2563eb', color2: '#0891b2',
    tags:     ['ML','Python','Analytics'],
    desc:     'Focused on analytical tooling, ML framework experience, model performance metrics, and data pipeline ownership.',
    tips:     ['Show model accuracy improvements with numbers','Mention datasets size and cleaning process','Highlight business impact of your models'],
    ready:    true,
  },
  {
    id: 3,
    title:    'Creative UI/UX Designer',
    industry: 'Creative',
    level:    'Mid',
    color1:   '#db2777', color2: '#9333ea',
    tags:     ['Figma','Design Systems','UX Research'],
    desc:     'Emphasizes wireframing, case studies, user psychology insights, design system ownership, and measurable improvements to UX metrics.',
    tips:     ['Include links to Figma or portfolio','Show before/after screenshots','Mention usability testing and conversion lifts'],
    ready:    true,
  },
  {
    id: 4,
    title:    'Corporate Finance Analyst',
    industry: 'Finance',
    level:    'Entry-Mid',
    color1:   '#059669', color2: '#0d9488',
    tags:     ['Valuation','Excel','Reporting'],
    desc:     'Tailored for investment banking, financial modelling, DCF valuation, and corporate reporting positions.',
    tips:     ['Open with a concise financial value summary','List Excel/Python modelling skills explicitly','Include deal sizes or portfolio values worked on'],
    ready:    true,
  },
  {
    id: 5,
    title:    'Clinical Health Administrator',
    industry: 'Healthcare',
    level:    'Mid',
    color1:   '#0891b2', color2: '#0284c7',
    tags:     ['EHR','Operations','Compliance'],
    desc:     'Highlights hospital operations management, patient relations, EHR systems, regulatory compliance, and staff coordination.',
    tips:     ['Show patient volume or department size','Mention specific EHR systems by name','Include any compliance certifications'],
    ready:    true,
  },
  {
    id: 6,
    title:    'Product Manager (SaaS)',
    industry: 'Tech',
    level:    'Senior',
    color1:   '#d97706', color2: '#b45309',
    tags:     ['Roadmap','Agile','Metrics'],
    desc:     'Built around lifecycle metrics, product roadmap definition, cross-functional alignment, and agile delivery with measurable user outcomes.',
    tips:     ['Lead with a product impact statement','Show DAU/MAU or conversion rate improvements','Mention the size of teams you coordinated'],
    ready:    false,
  },
  {
    id: 7,
    title:    'Investment Associate',
    industry: 'Finance',
    level:    'Entry',
    color1:   '#64748b', color2: '#475569',
    tags:     ['VC','PE','Deal Flow'],
    desc:     'Structured for private equity and venture capital roles — covering deal sourcing, due diligence, portfolio management, and financial research.',
    tips:     ['Mention deal sizes you contributed to','Highlight financial modelling depth','Show any investment thesis you helped develop'],
    ready:    false,
  },
  {
    id: 8,
    title:    'Lead Content Strategist',
    industry: 'Creative',
    level:    'Senior',
    color1:   '#7c3aed', color2: '#db2777',
    tags:     ['SEO','Brand Voice','Content'],
    desc:     'Highlights content calendars, SEO performance metrics, campaign reach, brand voice ownership, and digital distribution strategy.',
    tips:     ['Show organic traffic growth percentages','Mention content tools you own (CMS, analytics)','Include campaign reach or engagement numbers'],
    ready:    false,
  },
];

const INDUSTRIES = ['All', 'Tech', 'Finance', 'Healthcare', 'Creative'];
const LEVELS     = ['All', 'Entry', 'Entry-Mid', 'Mid', 'Senior'];

// ─── Preview card gradient background ───
function TemplatePreview({ color1, color2, title, ready }) {
  return (
    <div style={{
      height: 160,
      borderRadius: 12,
      background: ready
        ? `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
        : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'flex-end',
      padding: '14px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative lines */}
      <div style={{ position:'absolute', inset:0, opacity: ready ? 0.12 : 0.0 }}>
        {[0.2,0.5,0.8].map((y, i) => (
          <div key={i} style={{ position:'absolute', top:`${y * 100}%`, left:16, right:16, height:1, background:'rgba(255,255,255,0.6)', borderRadius:1 }} />
        ))}
        {[0.3,0.6].map((y, i) => (
          <div key={i} style={{ position:'absolute', top:`${y * 100}%`, left:16, right:'40%', height:1, background:'rgba(255,255,255,0.4)', borderRadius:1 }} />
        ))}
      </div>
      <span style={{ fontSize:'0.72rem', fontWeight:700, color: ready ? 'rgba(255,255,255,0.85)' : '#94a3b8', textTransform:'uppercase', letterSpacing:'1px' }}>
        {ready ? 'Available now' : 'Coming soon'}
      </span>
    </div>
  );
}

export default function ResumeExamples() {
  const [industry, setIndustry] = useState('All');
  const [level,    setLevel]    = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = TEMPLATES.filter(t =>
    (industry === 'All' || t.industry === industry) &&
    (level    === 'All' || t.level    === level)
  );

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .examples-page { font-family:'Inter',system-ui,sans-serif; }
        .template-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 18px;
          padding: 20px;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .template-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,0.08); }
        .filter-btn {
          padding: 6px 14px; border-radius: 99px; font-size: 0.8rem;
          font-weight: 500; border: none; cursor: pointer;
          font-family:'Inter',system-ui,sans-serif; transition: all 0.16s;
        }
        .tag-chip {
          padding: 3px 9px; border-radius: 99px; font-size: 0.7rem;
          font-weight: 600; border: 1px solid transparent;
        }
        .use-btn {
          width: 100%; padding: 11px 0; border-radius: 11px;
          font-size: 0.85rem; font-weight: 700; cursor: pointer;
          font-family:'Inter',system-ui,sans-serif; border: none;
          transition: all 0.18s;
        }
        .tips-list { margin: 0; padding: 0 0 0 16px; }
        .tips-list li { font-size: 0.78rem; color: #475569; line-height: 1.65; margin-bottom: 4px; }
        @media(max-width:640px){ .filter-row { flex-direction:column!important; } }
      `}</style>

      <div className="examples-page">

        {/* ── Header ── */}
        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:'clamp(1.6rem,3.5vw,2.1rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.8px', marginBottom:6 }}>
            Resume Examples
          </h1>
          <p style={{ color:'#64748b', fontSize:'0.92rem', maxWidth:520 }}>
            Browse industry-specific resume structures designed to pass ATS filters and impress hiring managers. Each template includes expert writing tips.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="filter-row" style={{ display:'flex', gap:24, marginBottom:32, flexWrap:'wrap' }}>
          <div>
            <p style={{ fontSize:'0.72rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Industry</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {INDUSTRIES.map(ind => (
                <button key={ind} className="filter-btn" onClick={() => setIndustry(ind)} style={{
                  background: industry === ind ? '#7c3aed' : 'rgba(0,0,0,0.04)',
                  color:      industry === ind ? '#fff'    : '#64748b',
                  boxShadow:  industry === ind ? '0 4px 12px rgba(124,58,237,0.22)' : 'none',
                }}>
                  {ind}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize:'0.72rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Experience Level</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {LEVELS.map(lv => (
                <button key={lv} className="filter-btn" onClick={() => setLevel(lv)} style={{
                  background: level === lv ? '#0f172a' : 'rgba(0,0,0,0.04)',
                  color:      level === lv ? '#fff'    : '#64748b',
                }}>
                  {lv}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results count ── */}
        <p style={{ fontSize:'0.8rem', color:'#94a3b8', marginBottom:20, fontWeight:500 }}>
          Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ── Template Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderRadius:20, border:'1px solid rgba(255,255,255,0.9)' }}>
            <p style={{ fontSize:'0.95rem', fontWeight:600, color:'#0f172a', marginBottom:6 }}>No templates match your filters</p>
            <p style={{ fontSize:'0.82rem', color:'#94a3b8' }}>Try adjusting the industry or level selectors above.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {filtered.map(t => (
              <div key={t.id} className="template-card" style={{ opacity: t.ready ? 1 : 0.75 }}>

                {/* Preview graphic */}
                <TemplatePreview color1={t.color1} color2={t.color2} title={t.title} ready={t.ready} />

                {/* Tags */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                  <span className="tag-chip" style={{ background:'rgba(0,0,0,0.04)', color:'#64748b' }}>{t.industry}</span>
                  <span className="tag-chip" style={{ background:`${t.color1}14`, color:t.color1, borderColor:`${t.color1}20` }}>{t.level}</span>
                  {t.tags.map(tag => (
                    <span key={tag} className="tag-chip" style={{ background:'rgba(0,0,0,0.03)', color:'#94a3b8' }}>{tag}</span>
                  ))}
                  {!t.ready && (
                    <span className="tag-chip" style={{ background:'rgba(245,158,11,0.1)', color:'#d97706', borderColor:'rgba(245,158,11,0.2)' }}>Soon</span>
                  )}
                </div>

                {/* Title + Description */}
                <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#0f172a', marginBottom:6, lineHeight:1.3 }}>{t.title}</h3>
                <p style={{ fontSize:'0.8rem', color:'#64748b', lineHeight:1.6, marginBottom:12, flex:1 }}>{t.desc}</p>

                {/* Expert tips accordion */}
                <button
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                  style={{ background:'transparent', border:'none', color:'#7c3aed', fontSize:'0.78rem', fontWeight:600, cursor:'pointer', fontFamily:'Inter,system-ui,sans-serif', padding:0, display:'flex', alignItems:'center', gap:4, marginBottom: expanded === t.id ? 10 : 14 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition:'transform 0.18s', transform: expanded === t.id ? 'rotate(180deg)' : 'none' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  {expanded === t.id ? 'Hide tips' : 'Writing tips'}
                </button>
                {expanded === t.id && (
                  <ul className="tips-list" style={{ marginBottom:14 }}>
                    {t.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                )}

                {/* CTA */}
                <button
                  className="use-btn"
                  disabled={!t.ready}
                  onClick={() => t.ready && alert(`Downloading template: ${t.title}`)}
                  style={{
                    background:  t.ready ? `linear-gradient(135deg, ${t.color1}, ${t.color2})` : 'rgba(0,0,0,0.05)',
                    color:       t.ready ? '#fff' : '#94a3b8',
                    cursor:      t.ready ? 'pointer' : 'default',
                    boxShadow:   t.ready ? `0 4px 14px ${t.color1}35` : 'none',
                  }}
                >
                  {t.ready ? 'Use This Template' : 'Notify Me When Ready'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Bottom tip ── */}
        <div style={{ marginTop:40, padding:'22px 24px', background:'rgba(124,58,237,0.05)', border:'1px solid rgba(124,58,237,0.1)', borderRadius:16 }}>
          <p style={{ fontSize:'0.85rem', color:'#4c1d95', fontWeight:500, lineHeight:1.6 }}>
            <strong>Pro tip:</strong> After downloading a template, head to the <strong>Resume Analyzer</strong> to instantly check how well your filled resume matches any target job description. Most users improve their match score by 25–40% after optimizing with AI suggestions.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
