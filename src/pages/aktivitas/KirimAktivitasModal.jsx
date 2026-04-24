import { useState } from "react";

import { CheckCircleOutlined } from "@ant-design/icons"; 


import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack
} from "@mui/material";

export default function KirimAktivitasModal({
  activityName,
  onConfirm
}) {

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
  if (onConfirm) {
    await onConfirm(); // panggil kirimAktivitas
  }
  setOpen(false);
};

  return (
    <>
    <Button
      size="small"
      color="success"
      variant="contained"
      onClick={handleOpen}
    >
      Kirim
    </Button>

    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Kirim Aktivitas
      </DialogTitle>

      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <CheckCircleOutlined
            style={{
              fontSize: 26,
          color: "#52c41a" // hijau, menandakan aksi positif
        }}
      />

      <div>
        <Typography variant="body2">
          Apakah Anda yakin ingin mengirim aktivitas
          <strong> {activityName || "-"} </strong>?
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Aktivitas yang sudah dikirim tidak dapat diubah lagi sebelum diverifikasi oleh atasan.
        </Typography>
      </div>
    </Stack>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleClose} variant="outlined">
      Batal
    </Button>

    <Button
      onClick={handleConfirm}
      color="success"
      variant="contained"
    >
      Kirim
    </Button>
  </DialogActions>

</Dialog>
</>
);
}