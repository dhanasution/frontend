import { Navigate, useLocation } from 'react-router-dom';

const normalizeRole = (role) => {
  if (!role) return '';
  return role.toString().trim().toLowerCase();
};

const getDefaultDashboard = (role) => {
  const r = normalizeRole(role);

  if (r === 'admin_utama') return '/dashboard/adminutama';
  if (r === 'admin_opd') return '/dashboard/adminopd';
  return '/dashboard/default';
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const roleRaw = localStorage.getItem('role');
  const role = normalizeRole(roleRaw);
  const location = useLocation();

  console.log('🔐 ProtectedRoute');
  console.log('ROLE RAW:', roleRaw);
  console.log('ROLE NORMALIZED:', role);
  console.log('ALLOWED:', allowedRoles);
  console.log('PATH:', location.pathname);

  // ❌ belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // normalisasi allowedRoles juga
  const normalizedAllowed = allowedRoles?.map((r) => normalizeRole(r));

  // ❌ role tidak sesuai
  if (normalizedAllowed && !normalizedAllowed.includes(role)) {
    console.log('❌ AKSES DITOLAK → redirect sesuai role');

    return <Navigate to={getDefaultDashboard(role)} replace />;
  }

  // ✅ lolos
  return children;
}