import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

const CATEGORIES = ['Classroom', 'Laboratory', 'Library', 'Hostel', 'Canteen', 'Washrooms', 'Infrastructure', 'Other'];

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required (min 5 chars)';
    else if (form.title.length < 5) e.title     = 'Title must be at least 5 characters';
    if (!form.description.trim()) e.description = 'Description is required (min 10 chars)';
    else if (form.description.length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.category)           e.category    = 'Please select a category';
    if (!form.location.trim())    e.location    = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await api.post('/complaints', form);
      setSuccess('✅ Complaint submitted successfully! You can track its status in My Complaints.');
      setForm({ title: '', description: '', category: '', location: '' });
      setTimeout(() => navigate('/my-complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <h1>📝 Submit a Complaint</h1>
            <p>Describe the issue and our team will address it promptly.</p>
          </div>

          <div style={{ maxWidth: 720 }}>
            {success && (
              <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                {success}
              </div>
            )}
            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                ⚠ {error}
              </div>
            )}

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="comp-title">
                      Complaint Title <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      id="comp-title"
                      className={`form-control${errors.title ? ' is-invalid' : ''}`}
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Brief title of the issue (e.g. Broken projector in Room 204)"
                      maxLength={100}
                    />
                    {errors.title && <span className="form-error">⚠ {errors.title}</span>}
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{form.title.length}/100</span>
                  </div>

                  {/* Category + Location row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="comp-category">
                        Category <span style={{ color: 'var(--danger-500)' }}>*</span>
                      </label>
                      <select
                        id="comp-category"
                        className={`form-control${errors.category ? ' is-invalid' : ''}`}
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                      >
                        <option value="">Select a category…</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.category && <span className="form-error">⚠ {errors.category}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="comp-location">
                        Location <span style={{ color: 'var(--danger-500)' }}>*</span>
                      </label>
                      <input
                        id="comp-location"
                        className={`form-control${errors.location ? ' is-invalid' : ''}`}
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Block A, Room 101"
                        maxLength={200}
                      />
                      {errors.location && <span className="form-error">⚠ {errors.location}</span>}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="comp-desc">
                      Description <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <textarea
                      id="comp-desc"
                      className={`form-control${errors.description ? ' is-invalid' : ''}`}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Provide a detailed description of the problem. Include when you noticed it, severity, and any relevant context…"
                      maxLength={1000}
                    />
                    {errors.description && <span className="form-error">⚠ {errors.description}</span>}
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{form.description.length}/1000</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
                    <button
                      id="submit-complaint-btn"
                      className="btn btn-primary btn-lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Submitting…</> : '📤 Submit Complaint'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setForm({ title:'', description:'', category:'', location:'' })}>
                      Clear Form
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tips card */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-body">
                <p className="section-title" style={{ marginBottom: '0.75rem' }}>💡 Tips for a Good Complaint</p>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: 2 }}>
                  <li>Be specific about the location and affected area.</li>
                  <li>Mention when you first noticed the issue.</li>
                  <li>Describe the impact on students or operations.</li>
                  <li>Include any previous attempts to fix it, if known.</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SubmitComplaint;
