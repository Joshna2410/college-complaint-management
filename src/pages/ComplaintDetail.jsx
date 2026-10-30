import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

const STATUSES = ['Pending', 'In Progress', 'Resolved'];

const ComplaintDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [updating, setUpdating]   = useState(false);
  const [updateStatus, setUpdateStatus]   = useState('');
  const [adminNote, setAdminNote]         = useState('');
  const [successMsg, setSuccessMsg]       = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data.complaint);
        setUpdateStatus(data.complaint.status);
        setAdminNote(data.complaint.adminNote || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Complaint not found or you are not authorized.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setSuccessMsg('');
    try {
      const { data } = await api.put(`/complaints/${id}`, { status: updateStatus, adminNote });
      setComplaint(data.complaint);
      setSuccessMsg('✅ Complaint updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update complaint.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminDelete = async () => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      navigate('/admin/complaints', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaint.');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="spinner-wrap"><div className="spinner" /></div>
        </main>
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="alert alert-error">{error}</div>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>← Go Back</button>
        </main>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginRight: '0.5rem' }}>
              ← Back
            </button>
            Complaints / <span style={{ color: 'var(--gray-800)', fontWeight: 600 }}>{complaint?.title}</span>
          </div>

          {successMsg && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{successMsg}</div>}

          <div className="detail-grid">
            {/* Main content */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <h1 style={{ fontSize: '1.375rem', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                        {complaint.title}
                      </h1>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="category-tag">{complaint.category}</span>
                        <StatusBadge status={complaint.status} />
                      </div>
                    </div>
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm" id="admin-delete-btn" onClick={handleAdminDelete}>
                        🗑 Delete
                      </button>
                    )}
                  </div>

                  <div style={{
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    borderLeft: '4px solid var(--primary-400)',
                  }}>
                    <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {complaint.description}
                    </p>
                  </div>

                  {complaint.adminNote && (
                    <div style={{
                      background: '#f0fdf4',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      border: '1px solid #bbf7d0',
                    }}>
                      <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        📝 Admin Note
                      </p>
                      <p style={{ color: '#166534', fontSize: '0.9rem' }}>{complaint.adminNote}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta info */}
              <div className="card">
                <div className="card-body">
                  <p className="section-title" style={{ marginBottom: '1rem' }}>Complaint Details</p>
                  <div className="detail-meta">
                    <div className="meta-item">
                      <span className="meta-label">📍 Location</span>
                      <span className="meta-value">{complaint.location}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">🗂 Category</span>
                      <span className="meta-value">{complaint.category}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">📅 Submitted</span>
                      <span className="meta-value">
                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">🔄 Last Updated</span>
                      <span className="meta-value">
                        {new Date(complaint.updatedAt).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}
                      </span>
                    </div>
                    {complaint.studentId && (
                      <>
                        <div className="meta-item">
                          <span className="meta-label">👤 Student Name</span>
                          <span className="meta-value">{complaint.studentId.name}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">✉ Student Email</span>
                          <span className="meta-value" style={{ fontSize: '0.875rem' }}>{complaint.studentId.email}</span>
                        </div>
                        {complaint.studentId.studentId && (
                          <div className="meta-item">
                            <span className="meta-label">🪪 Student ID</span>
                            <span className="meta-value">{complaint.studentId.studentId}</span>
                          </div>
                        )}
                        {complaint.studentId.department && (
                          <div className="meta-item">
                            <span className="meta-label">🏫 Department</span>
                            <span className="meta-value">{complaint.studentId.department}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar — Admin actions or status display */}
            <div>
              <div className="card">
                <div className="card-body">
                  <p className="section-title" style={{ marginBottom: '1rem' }}>Status</p>
                  {isAdmin ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="status-select">Update Status</label>
                        <select
                          id="status-select"
                          className="status-select"
                          value={updateStatus}
                          onChange={e => setUpdateStatus(e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="admin-note">Admin Note (optional)</label>
                        <textarea
                          id="admin-note"
                          className="form-control"
                          rows={4}
                          value={adminNote}
                          onChange={e => setAdminNote(e.target.value)}
                          placeholder="Add a note for the student…"
                          maxLength={500}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{adminNote.length}/500</span>
                      </div>

                      <button
                        id="update-complaint-btn"
                        className="btn btn-primary btn-full"
                        onClick={handleUpdate}
                        disabled={updating}
                      >
                        {updating ? 'Saving…' : '💾 Save Changes'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <StatusBadge status={complaint.status} />
                      <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                        {complaint.status === 'Pending' && 'Your complaint is awaiting admin review.'}
                        {complaint.status === 'In Progress' && 'An admin is currently working on your complaint.'}
                        {complaint.status === 'Resolved' && 'Your complaint has been resolved. Thank you!'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ComplaintDetail;
