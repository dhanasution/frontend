import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  // ❌ Belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 PROTEKSI BERDASARKAN URL
  const path = location.pathname;

  // Admin Utama only
  if (path.startsWith('/dashboard/adminutama') && role !== 'admin utama') {
    return <Navigate to="/dashboard/default" replace />;
  }

  // Admin OPD only
  if (path.startsWith('/dashboard/adminopd') && role !== 'admin opd') {
    return <Navigate to="/dashboard/default" replace />;
  }

  return children;
}