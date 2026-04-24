import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";

export default function EditAktivitasModal({ open, onClose, data, onSubmit }) {

  const initialForm = {
    lokasi: "",
    kategori: "",
    namaKegiatan: "",
    deskripsi: "",
    durasi: "",
    status: "draft",
    linkBukti: ""
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  /* ================= NOTIFICATION ================= */

  const showNotify = (msg, sev = "success") => {
    setNotify({
      open: true,
      message: msg,
      severity: sev
    });
  };

  const closeNotify = () => {
    setNotify((p) => ({ ...p, open: false }));
  };

  /* ================= LOAD DATA ================= */

  useEffect(() => {

  if (!open || !data) return;

  setForm({
    lokasi: data.lokasi ?? "",
    kategori: data.kategori ?? "",
    namaKegiatan: data.nama_kegiatan ?? "",
    deskripsi: data.deskripsi ?? "",
    durasi: data.durasi ?? "",
    status: (data.status ?? "draft").toLowerCase(),
    linkBukti: data.link_bukti ?? ""
  });

}, [open, data]);

  /* ================= RESET ================= */

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  /* ================= CHANGE ================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  /* ================= VALIDATION ================= */

  const validate = () => {

    if (!form.namaKegiatan.trim()) {
      showNotify("Nama kegiatan wajib diisi", "error");
      return false;
    }

    if (!form.kategori) {
      showNotify("Kategori wajib dipilih", "error");
      return false;
    }

    if (!form.durasi) {
      showNotify("Durasi wajib dipilih", "error");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

      const payload = {
        id: data?.id,
        lokasi: form.lokasi,
        kategori: form.kategori,
        nama_kegiatan: form.namaKegiatan,
        deskripsi: form.deskripsi,
        durasi: Number(form.durasi),
        status: String(form.status).toLowerCase(),
        link_bukti: form.linkBukti
      };

      console.log("PAYLOAD UPDATE:", payload);

      if (onSubmit) {

        const res = await onSubmit(payload);

        if (!res || res.success !== true) {
          throw new Error(res?.message || "Gagal memperbaharui aktivitas");
        }

      }

      showNotify("Aktivitas berhasil diperbaharui");

      setTimeout(() => {
        handleClose();
      }, 500);

    } catch (err) {

      console.error("UPDATE ERROR:", err);

      showNotify(
        err?.message || "Gagal memperbaharui aktivitas",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };

  /* ================= UI ================= */

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>

        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            Edit Aktivitas
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Perbarui aktivitas harian
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>

          <Stack spacing={2.5} mt={1}>

            {/* LOKASI */}

            <FormControl>

              <Typography fontWeight={600}>
                Lokasi Kerja
              </Typography>

              <RadioGroup
                row
                name="lokasi"
                value={form.lokasi}
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

            </FormControl>

            {/* KATEGORI */}

            <FormControl fullWidth>

              <InputLabel>Kategori</InputLabel>

              <Select
                name="kategori"
                value={form.kategori}
                label="Kategori"
                onChange={handleChange}
              >

                <MenuItem value="Administrasi">Administrasi</MenuItem>
                <MenuItem value="Teknis">Teknis</MenuItem>
                <MenuItem value="Lapangan">Lapangan</MenuItem>
                <MenuItem value="Koordinasi">Koordinasi</MenuItem>

              </Select>

            </FormControl>

            {/* NAMA KEGIATAN */}

            <TextField
              label="Nama Kegiatan"
              name="namaKegiatan"
              value={form.namaKegiatan}
              onChange={handleChange}
              fullWidth
            />

            {/* DESKRIPSI */}

            <TextField
              label="Deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            {/* DURASI */}

            <FormControl fullWidth>

              <InputLabel>Durasi</InputLabel>

              <Select
                name="durasi"
                value={form.durasi}
                label="Durasi"
                onChange={handleChange}
              >

                {[1,2,3,4,5,6].map((d) => (
                  <MenuItem key={d} value={d}>
                    {d} Jam
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

            {/* STATUS */}

            <FormControl>

              <Typography fontWeight={600}>
                Status Aktivitas
              </Typography>

              <RadioGroup
                row
                name="status"
                value={form.status}
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

            </FormControl>

            {/* LINK BUKTI */}

            <TextField
              label="Link Bukti"
              name="linkBukti"
              value={form.linkBukti}
              onChange={handleChange}
              fullWidth
            />

          </Stack>

        </DialogContent>

        <Divider />

        <DialogActions>

          <Button onClick={handleClose} variant="outlined">
            Batal
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={18} color="inherit" />
            }
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>

        </DialogActions>

      </Dialog>

      <Snackbar
        open={notify.open}
        autoHideDuration={3000}
        onClose={closeNotify}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert severity={notify.severity} variant="filled">
          {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
}

EditAktivitasModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  onSubmit: PropTypes.func
};