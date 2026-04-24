import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Stack,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  CircularProgress,
  InputAdornment
} from '@mui/material';

import { CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';

/* ================= CUSTOM ================= */
import useAktivitasForm from './hooks/useAktivitasForm';
import validateAktivitas from './utils/validateAktivitas';
import StatusBadge from './components/StatusBadge';


//
const getDiffDays = (tanggal) => {
  if (!tanggal) return Infinity;

  const selected = new Date(tanggal);
  const today = new Date();

  selected.setHours(0,0,0,0);
  today.setHours(0,0,0,0);

  const diffTime = today - selected;

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));

};
//


export default function TambahAktivitasModal({ open, onClose, onSubmit }) {
  /* ================= HOOK ================= */
  const {
    form = {},
    errors = {},
    setErrors,
    formEnabled,
    setFormEnabled,
    pesanAbsen,
    setPesanAbsen,
    loadingCek,
    setLoadingCek,
    handleChange,
    resetForm,
    maxDate,
    minDate
  } = useAktivitasForm(open);


  /* ================= STATE ================= */
  const [notify, setNotify] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  /* ================= NOTIFY ================= */
  const showNotify = (msg, sev = 'success') => {
    setNotify({ open: true, message: msg, severity: sev });
  };

  const closeNotify = () => {
    setNotify((p) => ({ ...p, open: false }));
  };

  /* ================= CEK ABSEN BOLEH INPUT ================= */
const cekBolehInput = async (tanggal) => {
  if (!tanggal) return false;

  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("TOKEN TIDAK ADA");
    return false;
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/aktivitas/cek-absen?tanggal=${tanggal}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // 🔥 HANDLE ERROR HTML (biar tidak "Unexpected token <")
    const text = await res.text();

    try {
      const data = JSON.parse(text);

      console.log("CEK ABSEN RESPONSE:", data);

      return data?.allowed === true;

    } catch {
      console.error("RESPON BUKAN JSON:", text);
      return false;
    }

  } catch (err) {
    console.error("CEK ABSEN ERROR:", err);
    return false;
  }
};

  /* ================= CEK ABSEN ================= */
  const handleCekAbsen = async () => {
  try {
    if (!form.tanggal) {
      showNotify("Tanggal wajib dipilih", "warning");
      return;
    }

    setLoadingCek(true);

    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("Silakan login ulang", "error");
      return;
    }

    /* ================= 1. CEK UNLOCK ================= */
    const bolehInput = await cekBolehInput(form.tanggal);

    if (!bolehInput) {
      setFormEnabled(false);
      setPesanAbsen("Tanggal terkunci (> 7 hari & belum di-unlock)");
      showNotify("Tanggal terkunci", "warning");
      return;
    }

    /* ================= 2. CEK ABSEN ================= */
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/aktivitas/cek-absen?tanggal=${form.tanggal}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await res.json();

    if (!res.ok || !result.allowed) {
      setFormEnabled(false);
      setPesanAbsen(result.message || "Tidak bisa input aktivitas");
      showNotify(result.message || "Tidak bisa input", "warning");
      return;
    }

    /* ================= 3. SUKSES ================= */
    setFormEnabled(true);
    setPesanAbsen(`Status: ${result.status}`);
    showNotify("Absen valid, silakan input", "success");

  } catch (err) {
    console.error(err);
    showNotify("Gagal cek absen", "error");
  } finally {
    setLoadingCek(false);
  }
};

  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoadingSubmit(true);

    if (!form.tanggal) {
      showNotify("Tanggal wajib diisi", "error");
      return;
    }

    /* ================= VALIDASI ================= */
    const validation = validateAktivitas(form, formEnabled);

    if (!validation.valid) {
      setErrors(validation.errors);
      showNotify("Lengkapi semua field", "error");
      return;
    }

    if (!form.status) {
      showNotify("Status wajib dipilih", "error");
      return;
    }

    /* ================= CEK UNLOCK ULANG ================= */
    const bolehInput = await cekBolehInput(form.tanggal);

    if (!bolehInput) {
      setFormEnabled(false);
      showNotify("Tanggal sudah terkunci", "error");
      return;
    }

    /* ================= WAJIB SUDAH CEK ABSEN ================= */
    if (!formEnabled) {
      showNotify("Silakan klik 'Cek Absen' terlebih dahulu", "warning");
      return;
    }

    /* ================= PAYLOAD ================= */
    const payload = {
      tanggal: form.tanggal,
      lokasi: form.lokasi,
      kategori: form.kategori,
      nama_kegiatan: form.namaKegiatan,
      deskripsi: form.deskripsi,
      durasi: form.durasi,
      link_bukti: form.linkBukti,
      status: form.status
    };

    const res = await onSubmit(payload);

    if (!res || res.success !== true) {
      throw new Error(res?.message || "Gagal menyimpan aktivitas");
    }

    showNotify("Aktivitas berhasil disimpan", "success");

    resetForm();
    onClose();

  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    showNotify(err.message || "Gagal menyimpan data", "error");
  } finally {
    setLoadingSubmit(false);
  }
};


  /* ================= RENDER ================= */
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography component="div" variant="h5" fontWeight={600}>
            Tambah Aktivitas
          </Typography>

      
          <Typography variant="body2" color="error">
            Minimal aktivitas sebanyak 2 dalam satu hari dan setiap aktivitas maksimal berdurasi 4 jam.
          </Typography>
        </DialogTitle>

        <Divider />

        <form noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2.5}>
              {/* TANGGAL */}
              <Stack direction="row" spacing={2}>
                <TextField
                  type="date"
                  label="Tanggal"
                  name="tanggal"
                  value={form?.tanggal || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.tanggal}
                  helperText={errors.tanggal}
                  inputProps={{
                    max: maxDate
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarOutlined />
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  variant="contained"
                  onClick={handleCekAbsen}
                  disabled={loadingCek}
                  startIcon={
                    loadingCek ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  }
                  sx={{
                    height: 44,
                    minWidth: 140,
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  {loadingCek ? 'Memeriksa...' : 'Cek Absen'}
                </Button>
              </Stack>

              {pesanAbsen && (
                <Alert severity={formEnabled ? 'success' : 'warning'}>
                  {pesanAbsen}
                </Alert>
              )}

              {/* LOKASI */}
              <FormControl disabled={!formEnabled} error={!!errors.lokasi}>
                <Typography fontWeight={600}>Lokasi Kerja</Typography>

                <RadioGroup
                  row
                  name="lokasi"
                  value={form?.lokasi || ''}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Kantor/WFO"
                    control={<Radio />}
                    label="Kantor / WFO"
                  />
                  <FormControlLabel
                    value="Dinas Luar/WFA"
                    control={<Radio />}
                    label="Dinas Luar / WFA"
                  />
                </RadioGroup>

                {errors.lokasi && (
                  <Typography color="error" variant="caption">
                    {errors.lokasi}
                  </Typography>
                )}
              </FormControl>

              {/* KATEGORI */}
              <FormControl
                fullWidth
                disabled={!formEnabled}
                error={!!errors.kategori}
              >
                <InputLabel>Kategori</InputLabel>

                <Select
                  name="kategori"
                  value={form?.kategori || ''}
                  label="Kategori"
                  onChange={handleChange}
                >
                  <MenuItem value="Administrasi">Administrasi</MenuItem>
                  <MenuItem value="Teknis">Teknis</MenuItem>
                  <MenuItem value="Lapangan">Lapangan</MenuItem>
                  <MenuItem value="Koordinasi">Koordinasi</MenuItem>
                </Select>

                {errors.kategori && (
                  <Typography color="error" variant="caption">
                    {errors.kategori}
                  </Typography>
                )}
              </FormControl>

              {/* NAMA */}
              <TextField
                label="Nama Kegiatan"
                name="namaKegiatan"
                value={form?.namaKegiatan || ''}
                onChange={handleChange}
                fullWidth
                disabled={!formEnabled}
                error={!!errors.namaKegiatan}
                helperText={errors.namaKegiatan}
              />

              {/* DESKRIPSI */}
              <TextField
                label="Deskripsi"
                name="deskripsi"
                value={form?.deskripsi || ''}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                disabled={!formEnabled}
                error={!!errors.deskripsi}
                helperText={errors.deskripsi}
              />

              {/* DURASI */}
              <FormControl
                fullWidth
                disabled={!formEnabled}
                error={!!errors.durasi}
              >
                <InputLabel>Durasi</InputLabel>

                <Select
                  name="durasi"
                  value={form?.durasi || ''}
                  label="Durasi"
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <MenuItem key={i} value={i}>
                      {i} Jam
                    </MenuItem>
                  ))}
                </Select>

                {errors.durasi && (
                  <Typography color="error" variant="caption">
                    {errors.durasi}
                  </Typography>
                )}
              </FormControl>

              {/* STATUS */}
              <FormControl disabled={!formEnabled} error={!!errors.status}>
                <Typography fontWeight={600}>
                  Status Aktivitas
                </Typography>

                <RadioGroup
                  row
                  name="status"
                  value={form?.status || ''}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="draft"
                    control={<Radio />}
                    label="Draft"
                  />
                  <FormControlLabel
                    value="final"
                    control={<Radio />}
                    label="Final"
                  />
                </RadioGroup>

                {errors.status && (
                  <Typography color="error" variant="caption">
                    {errors.status}
                  </Typography>
                )}
              </FormControl>

              {/* LINK */}
              <TextField
                label="Link Bukti"
                name="linkBukti"
                value={form?.linkBukti || ''}
                onChange={handleChange}
                fullWidth
                disabled={!formEnabled}
                error={!!errors.linkBukti}
                helperText={errors.linkBukti}
              />
            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions>
            <Button onClick={onClose} variant="outlined">
              Batal
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!formEnabled || loadingSubmit}
              startIcon={
                loadingSubmit && (
                  <CircularProgress size={18} color="inherit" />
                )
              }
            >
              {loadingSubmit ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* NOTIFIKASI */}
      <Snackbar
        open={notify.open}
        autoHideDuration={3000}
        onClose={closeNotify}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={notify.severity} variant="filled">
          {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
}