import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const FEATURES = [
  {
    icon: '📝',
    title: 'Easy Submission',
    desc: 'Submit complaints in seconds with our intuitive form. Select category, describe the issue, and track progress instantly.',
  },
  {
    icon: '🔍',
    title: 'Real-Time Tracking',
    desc: 'Monitor the status of every complaint — Pending, In Progress, or Resolved — from your personal dashboard.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Your complaints are protected with JWT authentication and bcrypt-hashed passwords. Only you and admins can see your data.',
  },
  {
    icon: '⚡',
    title: 'Fast Resolution',
    desc: 'Administrators receive instant visibility into all complaints and can update statuses to keep students informed.',
  },
  {
    icon: '📊',
    title: 'Admin Dashboard',
    desc: 'A powerful admin interface with statistics, search, filters, and detailed complaint management tools.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    desc: 'Access the system from any device. Fully responsive design ensures a seamless experience on phones and tablets.',
  },
];

const CATEGORIES = ['Classroom', 'Laboratory', 'Library', 'Hostel', 'Canteen', 'Washrooms', 'Infrastructure', 'Other'];

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              🎓 College Complaint Management System
            </div>
            <h1>Your Voice Matters.<br />We're Listening.</h1>
            <p className="hero-sub">
              Submit, track, and resolve college facility complaints efficiently.
              Empowering students and administrators with a transparent, digital complaint workflow.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="btn btn-primary btn-lg">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login-btn">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <div style={{ background: 'var(--primary-800)', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map(c => (
              <span key={c} style={{
                background: 'rgba(255,255,255,.12)',
                color: '#fff',
                borderRadius: '9999px',
                padding: '0.25rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="features-heading">
            <h2>Everything You Need</h2>
            <p>A complete complaint management platform built for modern college campuses.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section style={{
          background: 'linear-gradient(135deg, var(--primary-800), var(--primary-900))',
          color: '#fff',
          padding: '4rem 0',
          textAlign: 'center',
        }}>
          <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Get Started?</h2>
            <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: '2rem', fontSize: '1rem' }}>
              Join your college community and start resolving issues today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
                Register as Student
              </Link>
              <Link to="/admin/login" className="btn btn-secondary btn-lg" id="cta-admin-btn"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.1)' }}>
                Admin Login
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} College Complaint Management System. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
