import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'components/Loadable';

// load komponen login
const LoginComponent = Loadable(lazy(() => import('pages/auth/Login')));

// wrapper untuk passing role
const LoginPage = ({ role }) => <LoginComponent role={role} />;

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    { index: true, element: <Navigate to="/login" replace /> },
    { path: 'login', element: <LoginComponent /> }
  ]
};

export default LoginRoutes;