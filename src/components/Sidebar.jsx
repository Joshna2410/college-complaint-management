import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentSidebar = () => (
  <aside className="sidebar" aria-label="Student navigation">
    <div className="sidebar-section">
      <p className="sidebar-label">Student Portal</p>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''} id="nav-dashboard">
            <span className="sidebar-nav-icon">🏠</span>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/submit-complaint" className={({ isActive }) => isActive ? 'active' : ''} id="nav-submit">
            <span className="sidebar-nav-icon">📝</span>
            Submit Complaint
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-complaints" className={({ isActive }) => isActive ? 'active' : ''} id="nav-my-complaints">
            <span className="sidebar-nav-icon">📋</span>
            My Complaints
          </NavLink>
        </li>
      </ul>
    </div>
    <div className="sidebar-section">
      <p className="sidebar-label">Help</p>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/dashboard#guide" className={() => ''}>
            <span className="sidebar-nav-icon">❓</span>
            How it Works
          </NavLink>
        </li>
      </ul>
    </div>
  </aside>
);

const AdminSidebar = () => (
  <aside className="sidebar" aria-label="Admin navigation">
    <div className="sidebar-section">
      <p className="sidebar-label">Admin Panel</p>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''} id="admin-nav-dashboard">
            <span className="sidebar-nav-icon">📊</span>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/complaints" className={({ isActive }) => isActive ? 'active' : ''} id="admin-nav-complaints">
            <span className="sidebar-nav-icon">📁</span>
            All Complaints
          </NavLink>
        </li>
      </ul>
    </div>
  </aside>
);

const Sidebar = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminSidebar /> : <StudentSidebar />;
};

export default Sidebar;
