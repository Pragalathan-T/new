import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>Online Exam Portal</h2>
          </div>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/student-exams" className="nav-link">Exams</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link nav-link-primary">Register</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Empowering Online Assessments</h1>
            <p className="hero-subtitle">
              Take exams anywhere, anytime with ease and security.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/about" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
          <div className="hero-icon">
            <div className="icon-container">
              🎓
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure Exams</h3>
            <p className="feature-description">
              Advanced security measures ensure fair and protected exam environments.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Instant Results</h3>
            <p className="feature-description">
              Get your exam results immediately with detailed performance analytics.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3 className="feature-title">Easy Access</h3>
            <p className="feature-description">
              Access your exams from any device, anywhere with our responsive platform.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <p className="footer-copyright">© 2024 Online Exam Portal. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/help" className="footer-link">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}