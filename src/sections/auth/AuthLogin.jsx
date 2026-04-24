import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// db
import axiosInstance from "../../services/axiosInstance";


export default function AuthLogin({ isDemo = false }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Formik
      initialValues={{ nip: '', password: '', submit: null }}
      validationSchema={Yup.object().shape({
        nip: Yup.string()
          .matches(/^[0-9]+$/, 'NIP harus berupa angka')
          .min(10, 'NIP minimal 10 digit')
          .max(20, 'NIP maksimal 20 digit')
          .required('NIP wajib diisi'),
        password: Yup.string()
          .required('Password wajib diisi')
          .test(
            'no-leading-trailing-whitespace',
            'Password tidak boleh diawali/diakhiri spasi',
            (value) => value === value?.trim()
          )
          .max(50, 'Password maksimal 50 karakter')
      })}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          setSubmitting(true);

          const response = await axiosInstance.post(
                "/api/auth/login",
                {
                  nip: values.nip,
                  password: values.password
                },
                {
                  timeout: 10000
                }
              );

          if (!response.data?.token || !response.data?.user) {
            throw new Error('Response tidak valid');
          }

          const { token, user } = response.data;

          //  NORMALISASI ROLE (optional)
          const userRole = user.role
            ?.toLowerCase()
            .replace(/\s+/g, '_')
            .trim();

          console.log('=== LOGIN SUCCESS ===');
          console.log('USER:', user);
          console.log('ROLE:', userRole);

          // 💾 SIMPAN SESSION
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', userRole);

          //axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // 🚀 REDIRECT
          navigate('/dashboard', { replace: true });

        } catch (error) {
          console.error('❌ LOGIN ERROR:', error);

          let message = 'Login gagal. Periksa NIP dan Password.';

          if (error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error.code === 'ECONNABORTED') {
            message = 'Koneksi ke server timeout';
          } else if (!error.response) {
            message = 'Server tidak terhubung';
          }

          setErrors({ submit: message });

        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="nip-login">NIP</InputLabel>
                <OutlinedInput
                  id="nip-login"
                  type="text"
                  value={values.nip}
                  name="nip"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Masukkan NIP"
                  fullWidth
                  error={Boolean(touched.nip && errors.nip)}
                />
              </Stack>
              {touched.nip && errors.nip && (
                <FormHelperText error>{errors.nip}</FormHelperText>
              )}
            </Grid>

            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.password && errors.password)}
                  placeholder="Masukkan Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>

            {errors.submit && (
              <Grid size={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}

            <Grid size={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Login
                </Button>
              </AnimateButton>
            </Grid>

          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = {
  isDemo: PropTypes.bool
};