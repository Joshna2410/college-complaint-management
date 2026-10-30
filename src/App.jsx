import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home            from './pages/Home';
import Login           from './pages/Login';
import Register        from './pages/Register';
import AdminLogin      from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints    from './pages/MyComplaints';
import AdminDashboard  from './pages/AdminDashboard';
import ComplaintDetail from './pages/ComplaintDetail';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/admin/login"  element={<AdminLogin />} />

        {/* Student protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/submit-complaint" element={
          <ProtectedRoute role="student"><SubmitComplaint /></ProtectedRoute>
        } />
        <Route path="/my-complaints" element={
          <ProtectedRoute role="student"><MyComplaints /></ProtectedRoute>
        } />

        {/* Admin protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/complaints" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />

        {/* Shared protected (any logged-in user) */}
        <Route path="/complaints/:id" element={
          <ProtectedRoute><ComplaintDetail /></ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
