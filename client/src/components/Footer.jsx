import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-container">
      {/* Background radial gradient glow matching brand colors */}
      <div className="footer-glow"></div>

      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/App_logo.png" alt="ResuMatch Logo" style={{ height: '32px', width: 'auto' }} />
            <span>ResuMatch<span className="logo-dot">.</span></span>
          </div>
          <p className="footer-tagline">
            Making every application count — empowering candidates to stand out and clear modern ATS filters.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h4>Product</h4>
            <ul>
              <li onClick={() => navigate('/')}>Home</li>
              <li>How It Works</li>
              <li>Features</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Resources</h4>
            <ul>
              <li>Company</li>
              <li>Blogs</li>
              <li>Community</li>
              <li className="careers-link">
                Careers <span className="hiring-tag">We're hiring!</span>
              </li>
              <li>About</li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">&copy; {new Date().getFullYear()} ResuMatch. All rights reserved.</p>
        
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/abhinash-pradhan-74b389294/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://github.com/abhinashp25" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="mailto:abhinashpradhan25@gmail.com" aria-label="Contact" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
