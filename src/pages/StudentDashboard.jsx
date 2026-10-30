import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints/my?limit=5');
        setComplaints(data.complaints);
      } catch {
        setError('Failed to load complaints.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          {/* Welcome header */}
          <div className="page-header">
            <h1>👋 Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p>Here's a summary of your complaint activity.</p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <StatCard icon="📋" label="Total Submitted"  value={stats.total}      colorClass="stat-blue"  />
            <StatCard icon="⏳" label="Pending"          value={stats.pending}    colorClass="stat-amber" />
            <StatCard icon="🔄" label="In Progress"      value={stats.inProgress} colorClass="stat-sky"   />
            <StatCard icon="✅" label="Resolved"         value={stats.resolved}   colorClass="stat-green" />
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/submit-complaint" className="btn btn-primary" id="dash-submit-btn">
              📝 Submit New Complaint
            </Link>
            <Link to="/my-complaints" className="btn btn-secondary" id="dash-view-btn">
              📋 View All My Complaints
            </Link>
          </div>

          {/* Recent complaints */}
          <div className="card">
            <div className="card-body">
              <div className="section-header">
                <div>
                  <p className="section-title">Recent Complaints</p>
                  <p className="section-subtitle">Your 5 most recent submissions</p>
                </div>
                <Link to="/my-complaints" className="btn btn-ghost btn-sm">View all →</Link>
              </div>

              {loading ? (
                <div className="spinner-wrap"><div className="spinner" /></div>
              ) : error ? (
                <div className="alert alert-error">{error}</div>
              ) : complaints.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No complaints yet</h3>
                  <p>You haven't submitted any complaints. Click the button above to get started.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr key={c._id}>
                          <td style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{c.title}</td>
                          <td><span className="category-tag">{c.category}</span></td>
                          <td style={{ color: 'var(--gray-500)' }}>{c.location}</td>
                          <td style={{ color: 'var(--gray-500)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                            {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                          </td>
                          <td><StatusBadge status={c.status} /></td>
                          <td>
                            <Link to={`/complaints/${c._id}`} className="btn btn-ghost btn-sm">View</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* How it works */}
          <div className="card" style={{ marginTop: '1.5rem' }} id="guide">
            <div className="card-body">
              <p className="section-title" style={{ marginBottom: '1.25rem' }}>How It Works</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                {[
                  { step: '1', icon: '📝', title: 'Submit', desc: 'Fill in complaint details and select a category.' },
                  { step: '2', icon: '🔍', title: 'Review', desc: 'Admin reviews and assigns a priority.' },
                  { step: '3', icon: '⚙️', title: 'Action', desc: 'Status changes to In Progress while being resolved.' },
                  { step: '4', icon: '✅', title: 'Resolved', desc: 'Complaint marked Resolved when fixed.' },
                ].map(s => (
                  <div key={s.step} style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'var(--primary-100)', color: 'var(--primary-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem', margin: '0 auto 0.75rem',
                    }}>{s.icon}</div>
                    <p style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>Step {s.step}: {s.title}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;
