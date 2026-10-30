import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-content">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">🎓</div>
          <span>CCMS</span>
        </Link>

        {/* Links */}
        <ul className="navbar-nav">
          {!isAuthenticated && (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Student Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/admin/login">Admin</Link></li>
            </>
          )}

          {isStudent && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/submit-complaint">Submit</Link></li>
              <li><Link to="/my-complaints">My Complaints</Link></li>
            </>
          )}

          {isAdmin && (
            <>
              <li><Link to="/admin/dashboard">Dashboard</Link></li>
            </>
          )}
        </ul>

        {/* User pill + logout */}
        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="navbar-user">
              <div className="navbar-avatar">{getInitials(user?.name)}</div>
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'rgba(255,255,255,.8)', fontSize: '0.8125rem' }}
              onClick={handleLogout}
              id="logout-btn"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
