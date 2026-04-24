import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';

// ================================|| JWT - LOGIN ||================================ //

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tentukan role berdasarkan path
  const role = useMemo(() => {
    if (location.pathname.includes('adminopd')) return 'admin_opd';
    if (location.pathname.includes('adminutama')) return 'admin_utama';
    return 'pegawai';
  }, [location.pathname]);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'baseline',
              justifyContent: 'space-between',
              mb: { xs: -0.5, sm: 0.5 }
            }}
          >
            <Typography variant="h3">
              {role === 'pegawai'
                ? 'Login Pegawai'
                : role === 'admin_opd'
                ? 'Login Admin OPD'
                : 'Login Admin Utama'}
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          {/* Kirim role ke AuthLogin untuk menentukan redirect */}
          <AuthLogin role={role} navigate={navigate} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}