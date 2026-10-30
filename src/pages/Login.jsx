import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

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
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🔐</div>
          <h2>Student Login</h2>
          <p>Sign in to access your complaint portal</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            ⚠ {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            id="login-submit-btn"
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Signing In…</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-divider">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="auth-divider" style={{ marginTop: '0.5rem' }}>
          Are you an admin? <Link to="/admin/login">Admin Login →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
