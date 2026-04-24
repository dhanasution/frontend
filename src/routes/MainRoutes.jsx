import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PrivateRoute from 'components/PrivateRoute';
import ProtectedRoute from 'components/ProtectedRoute';

// verifikasi pages
import VerifikasiAktivitas from 'pages/verifikasi/VerifikasiAktivitas';
import RiwayatVerifikasi from 'pages/riwayat_verifikasi/RiwayatVerifikasi';

// pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const DashboardAdminOPD = Loadable(lazy(() => import('pages/dashboard/adminopd')));
const DashboardAdminUtama = Loadable(lazy(() => import('pages/dashboard/adminutama')));

const Aktivitas = Loadable(lazy(() => import('pages/aktivitas/aktivitas')));
const RekapAktivitas = Loadable(lazy(() => import('pages/rekap_aktivitas/rekap_aktivitas')));
const RekapAbsensi = Loadable(lazy(() => import('pages/rekap-absensi/index')));
const TPP = Loadable(lazy(() => import('pages/perhitunganTPP/perhitunganTPP')));

// ================= HELPER ROLE =================
const getDefaultDashboard = () => {
  const role = localStorage.getItem('role');

  if (role === 'admin_utama') return '/dashboard/adminutama';
  if (role === 'admin_opd') return '/dashboard/adminopd';
  return '/dashboard/default';
};

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    // 🔥 DEFAULT REDIRECT (INI KUNCI UTAMA)
    {
      path: '/',
      element: <Navigate to={getDefaultDashboard()} replace />
    },

    // ================= DASHBOARD =================
    {
      path: 'dashboard/default',
      element: (
        <ProtectedRoute allowedRoles={['pegawai', 'admin_opd', 'admin_utama']}>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'dashboard/adminopd',
      element: (
        <ProtectedRoute allowedRoles={['admin_opd']}>
          <DashboardAdminOPD />
        </ProtectedRoute>
      )
    },
    {
      path: 'dashboard/adminutama',
      element: (
        <ProtectedRoute allowedRoles={['admin_utama']}>
          <DashboardAdminUtama />
        </ProtectedRoute>
      )
    },

    // ================= MENU UMUM =================
    {
      path: 'aktivitas',
      element: <Aktivitas />
    },
    {
      path: 'rekap_aktivitas',
      element: <RekapAktivitas />
    },
    {
      path: 'rekap_absensi',
      element: <RekapAbsensi />
    },
    {
      path: 'tpp',
      element: <TPP />
    },

    // ================= VERIFIKASI =================
    {
      path: 'verifikasi',
      children: [
        {
          path: 'aktivitas',
          element: <VerifikasiAktivitas />
        },
        {
          path: 'riwayat',
          element: <RiwayatVerifikasi />
        }
      ]
    },

    // 🔥 WILDCARD (ANTI NYASAR KE DEFAULT LAGI)
    {
      path: '*',
      element: <Navigate to={getDefaultDashboard()} replace />
    }
  ]
};

export default MainRoutes;