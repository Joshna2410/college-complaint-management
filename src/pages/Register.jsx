
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Keep Field outside Register so it doesn't remount while typing
const Field = ({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  required,
  form,
  fieldErrors,
  handleChange
}) => (
  <div className="form-group">
    <label className="form-label" htmlFor={id}>
      {label} {required && <span style={{ color: 'var(--danger-500)' }}>*</span>}
    </label>

    <input
      id={id}
      className={`form-control${fieldErrors[name] ? ' is-invalid' : ''}`}
      type={type}
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      autoComplete={type === 'password' ? 'new-password' : 'on'}
    />

    {fieldErrors[name] && (
      <span className="form-error">⚠ {fieldErrors[name]}</span>
    )}
  </div>
);

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = 'Full name is required';

    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Enter a valid email';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(p => ({ ...p, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(p => ({ ...p, [name]: '' }));
    }

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        studentId: form.studentId.trim(),
        department: form.department.trim(),
      });

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <h2>Create Account</h2>
          <p>Register to submit and track complaints</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            ⚠ {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <Field
            id="reg-name"
            label="Full Name"
            name="name"
            placeholder="John Doe"
            required
            form={form}
            fieldErrors={fieldErrors}
            handleChange={handleChange}
          />

          <Field
            id="reg-email"
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@college.edu"
            required
            form={form}
            fieldErrors={fieldErrors}
            handleChange={handleChange}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field
              id="reg-sid"
              label="Student ID"
              name="studentId"
              placeholder="e.g. CS2021001"
              form={form}
              fieldErrors={fieldErrors}
              handleChange={handleChange}
            />

            <Field
              id="reg-dept"
              label="Department"
              name="department"
              placeholder="e.g. Computer Science"
              form={form}
              fieldErrors={fieldErrors}
              handleChange={handleChange}
            />
          </div>

          <Field
            id="reg-password"
            label="Password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            required
            form={form}
            fieldErrors={fieldErrors}
            handleChange={handleChange}
          />

          <Field
            id="reg-confirm"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat password"
            required
            form={form}
            fieldErrors={fieldErrors}
            handleChange={handleChange}
          />

          <button
            id="register-submit-btn"
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading
              ? <>Creating Account…</>
              : 'Create Account'}
          </button>

        </form>

        <p className="auth-divider">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
