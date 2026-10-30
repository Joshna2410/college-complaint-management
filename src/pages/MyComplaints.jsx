import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

const CATEGORIES = ['', 'Classroom', 'Laboratory', 'Library', 'Hostel', 'Canteen', 'Washrooms', 'Infrastructure', 'Other'];
const STATUSES   = ['', 'Pending', 'In Progress', 'Resolved'];

// Confirm delete modal
const ConfirmModal = ({ complaint, onConfirm, onCancel, loading }) => (
  <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
    <div className="modal">
      <div className="modal-header">
        <p className="modal-title" id="delete-modal-title">🗑️ Delete Complaint</p>
        <button className="modal-close" onClick={onCancel} aria-label="Close">×</button>
      </div>
      <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
        Are you sure you want to delete:
      </p>
      <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.5rem' }}>"{complaint?.title}"</p>
      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>This action cannot be undone. Only pending complaints can be deleted.</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="btn btn-danger" id="confirm-delete-btn" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting…' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </div>
);

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filters, setFilters]       = useState({ status: '', category: '', search: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.status)   params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      const { data } = await api.get(`/complaints/my?${params}`);
      setComplaints(data.complaints);
    } catch {
      setError('Failed to load complaints. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.category]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/complaints/${deleteTarget._id}`);
      setComplaints(p => p.filter(c => c._id !== deleteTarget._id));
      setSuccessMsg('Complaint deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaint.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Client-side search on title/location
  const displayed = filters.search
    ? complaints.filter(c =>
        c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.location.toLowerCase().includes(filters.search.toLowerCase())
      )
    : complaints;

  return (
    <>
      <Navbar />
      {deleteTarget && (
        <ConfirmModal
          complaint={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <h1>📋 My Complaints</h1>
            <p>Track all your submitted complaints and their statuses.</p>
          </div>

          {successMsg && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{successMsg}</div>}
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {/* Filters */}
          <div className="filter-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                id="my-search"
                className="form-control"
                placeholder="Search by title or location…"
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              />
            </div>
            <select
              id="my-filter-status"
              className="form-control"
              value={filters.status}
              onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
              style={{ maxWidth: 180 }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
            <select
              id="my-filter-category"
              className="form-control"
              value={filters.category}
              onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}
              style={{ maxWidth: 180 }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
            </select>
            <Link to="/submit-complaint" className="btn btn-primary btn-sm" id="my-submit-new-btn">
              + New Complaint
            </Link>
          </div>

          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              {loading ? (
                <div className="spinner-wrap"><div className="spinner" /></div>
              ) : displayed.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No complaints found</h3>
                  <p>{complaints.length === 0 ? "You haven't submitted any complaints yet." : 'Try adjusting your filters.'}</p>
                </div>
              ) : (
                <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map((c, i) => (
                        <tr key={c._id}>
                          <td style={{ color: 'var(--gray-400)', fontSize: '0.8125rem' }}>{i + 1}</td>
                          <td style={{ fontWeight: 600, maxWidth: 220 }}>
                            <Link to={`/complaints/${c._id}`} style={{ color: 'var(--primary-700)' }}>
                              {c.title}
                            </Link>
                          </td>
                          <td><span className="category-tag">{c.category}</span></td>
                          <td style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{c.location}</td>
                          <td style={{ color: 'var(--gray-500)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                            {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                          </td>
                          <td><StatusBadge status={c.status} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <Link to={`/complaints/${c._id}`} className="btn btn-ghost btn-sm" id={`view-btn-${c._id}`}>View</Link>
                              {c.status === 'Pending' && (
                                <button
                                  className="btn btn-danger btn-sm"
                                  id={`delete-btn-${c._id}`}
                                  onClick={() => setDeleteTarget(c)}
                                >
                                  Delete
                                </button>
                              )}
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

          <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
            Showing {displayed.length} of {complaints.length} complaints.
          </p>
        </main>
      </div>
    </>
  );
};

export default MyComplaints;
