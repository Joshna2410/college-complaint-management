import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

const CATEGORIES = ['', 'Classroom', 'Laboratory', 'Library', 'Hostel', 'Canteen', 'Washrooms', 'Infrastructure', 'Other'];
const STATUSES   = ['', 'Pending', 'In Progress', 'Resolved'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats]           = useState({ Total: 0, Pending: 0, 'In Progress': 0, Resolved: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filters, setFilters]       = useState({ status: '', category: '', search: '' });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status)   params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      if (filters.search)   params.set('search', filters.search);
      params.set('limit', '50');

      const { data } = await api.get(`/complaints?${params}`);
      setComplaints(data.complaints);
      if (data.stats) setStats(data.stats);
    } catch {
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Fetch full stats separately so they don't change with filters
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/complaints/stats');
        setStats({ Total: data.total, Pending: data.pending, 'In Progress': data.inProgress, Resolved: data.resolved });
      } catch { /* stats fail silently */ }
    };
    fetchStats();
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleQuickStatusChange = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    try {
      const { data } = await api.put(`/complaints/${complaintId}`, { status: newStatus });
      setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: data.complaint.status } : c));
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      setComplaints(prev => prev.filter(c => c._id !== id));
      setStats(s => ({ ...s, Total: s.Total - 1 }));
    } catch {
      setError('Failed to delete complaint.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <h1>📊 Admin Dashboard</h1>
            <p>Welcome back, {user?.name}. Manage all student complaints here.</p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <StatCard icon="📁" label="Total Complaints"  value={stats.Total}          colorClass="stat-blue"  />
            <StatCard icon="⏳" label="Pending"           value={stats.Pending}        colorClass="stat-amber" />
            <StatCard icon="🔄" label="In Progress"       value={stats['In Progress']} colorClass="stat-sky"   />
            <StatCard icon="✅" label="Resolved"          value={stats.Resolved}       colorClass="stat-green" />
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {/* Filters */}
          <div className="filter-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                id="admin-search"
                className="form-control"
                placeholder="Search title, description, location…"
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && fetchAll()}
              />
            </div>
            <select
              id="admin-filter-status"
              className="form-control"
              value={filters.status}
              onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
              style={{ maxWidth: 180 }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
            <select
              id="admin-filter-category"
              className="form-control"
              value={filters.category}
              onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}
              style={{ maxWidth: 180 }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" id="admin-search-btn" onClick={fetchAll}>Search</button>
          </div>

          {/* Table */}
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)' }}>
                <div className="section-header" style={{ marginBottom: 0 }}>
                  <div>
                    <p className="section-title">All Complaints</p>
                    <p className="section-subtitle">Showing {complaints.length} results</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="spinner-wrap"><div className="spinner" /></div>
              ) : complaints.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No complaints found</h3>
                  <p>Try adjusting your search filters.</p>
                </div>
              ) : (
                <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Student</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Quick Update</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c, i) => (
                        <tr key={c._id}>
                          <td style={{ color: 'var(--gray-400)', fontSize: '0.8125rem' }}>{i + 1}</td>
                          <td style={{ maxWidth: 200 }}>
                            <Link to={`/complaints/${c._id}`} style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                              {c.title}
                            </Link>
                          </td>
                          <td>
                            <div>
                              <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-800)' }}>
                                {c.studentId?.name || 'Unknown'}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                {c.studentId?.email}
                              </p>
                            </div>
                          </td>
                          <td><span className="category-tag">{c.category}</span></td>
                          <td style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{c.location}</td>
                          <td style={{ color: 'var(--gray-500)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                            {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                          </td>
                          <td><StatusBadge status={c.status} /></td>
                          <td>
                            <select
                              className="status-select"
                              id={`quick-status-${c._id}`}
                              style={{ minWidth: 130 }}
                              value={c.status}
                              disabled={updatingId === c._id}
                              onChange={e => handleQuickStatusChange(c._id, e.target.value)}
                            >
                              {['Pending', 'In Progress', 'Resolved'].map(s =>
                                <option key={s} value={s}>{s}</option>
                              )}
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <Link to={`/complaints/${c._id}`} className="btn btn-ghost btn-sm" id={`admin-view-${c._id}`}>
                                View
                              </Link>
                              <button
                                className="btn btn-danger btn-sm"
                                id={`admin-del-${c._id}`}
                                onClick={() => handleDelete(c._id)}
                              >
                                Del
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
