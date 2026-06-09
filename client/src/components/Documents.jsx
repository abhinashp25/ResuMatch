import { useState } from 'react';
import AppLayout from './AppLayout';

export default function Documents() {
  const [filter, setFilter] = useState('All');
  const [docs, setDocs] = useState([
    { id: 1, title: 'Abhinash_Resume_Tech.pdf', type: 'Resume', date: '2026-06-05', size: '240 KB' },
    { id: 2, title: 'Google_Frontend_Cover_Letter.docx', type: 'Cover Letter', date: '2026-06-07', size: '45 KB' },
    { id: 3, title: 'Abhinash_Resume_General.pdf', type: 'Resume', date: '2026-05-28', size: '215 KB' },
    { id: 4, title: 'Meta_Software_Engineer_Cover_Letter.docx', type: 'Cover Letter', date: '2026-06-01', size: '48 KB' },
  ]);

  const handleCreateNew = () => {
    const title = prompt('Enter the name of your new document:');
    if (!title) return;
    const type = confirm('Is it a Resume? (OK for Resume, Cancel for Cover Letter)') ? 'Resume' : 'Cover Letter';
    const extension = type === 'Resume' ? '.pdf' : '.docx';
    const newDoc = {
      id: Date.now(),
      title: title.endsWith(extension) ? title : `${title}${extension}`,
      type,
      date: new Date().toISOString().split('T')[0],
      size: '15 KB'
    };
    setDocs([newDoc, ...docs]);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocs(docs.filter(doc => doc.id !== id));
    }
  };

  const filteredDocs = filter === 'All' 
    ? docs 
    : docs.filter(doc => doc.type === filter);

  return (
    <AppLayout>
      <div className="docs-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Documents</h1>
          <p style={{ color: 'var(--text-light-muted)' }}>Manage, edit, and tailor your professional resumes and cover letters.</p>
        </div>
        <button className="app-btn-liquid" onClick={handleCreateNew}>
          <span>+</span> Create New
        </button>
      </div>

      <div className="docs-filters">
        {['All', 'Resume', 'Cover Letter'].map((type) => (
          <button
            key={type}
            className={`docs-filter-btn ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type}s
          </button>
        ))}
      </div>

      {filteredDocs.length === 0 ? (
        <div className="app-liquid-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '20px' }}>📁</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No documents found</h3>
          <p style={{ color: 'var(--text-light-muted)', marginBottom: '24px' }}>
            There are no documents matching "{filter}". Start by creating one now!
          </p>
          <button className="app-btn-liquid" onClick={handleCreateNew}>
            Create Document
          </button>
        </div>
      ) : (
        <div className="docs-grid">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="app-liquid-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="doc-card-header">
                  <span className="doc-badge" style={{ background: doc.type === 'Resume' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: doc.type === 'Resume' ? 'var(--primary-light-theme)' : '#3b82f6' }}>
                    {doc.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light-muted)' }}>{doc.size}</span>
                </div>
                <h3 className="doc-title">{doc.title}</h3>
                <p className="doc-meta">Edited {doc.date}</p>
              </div>
              <div className="doc-actions" style={{ marginTop: '20px' }}>
                <button 
                  className="app-btn-liquid app-btn-liquid-secondary" 
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', fontSize: '0.85rem' }}
                  onClick={() => alert(`Opening ${doc.title} editor...`)}
                >
                  Edit
                </button>
                <button 
                  className="app-btn-liquid app-btn-liquid-secondary" 
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
