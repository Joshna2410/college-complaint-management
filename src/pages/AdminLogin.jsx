import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter admin email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      if (data.user.role !== 'admin') {
        setError('Access denied. This login is for administrators only.');
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
    }}>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #1e3a8a, #0ea5e9)' }}>
            🛡️
          </div>
          <h2>Administrator Login</h2>
          <p>Secure access for college administrators</p>
        </div>

        

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            ⚠ {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@college.edu"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            id="admin-login-submit-btn"
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)' }}
          >
            {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Authenticating…</> : '🔐 Admin Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
