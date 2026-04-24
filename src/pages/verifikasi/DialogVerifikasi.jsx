import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  TextField,
  CircularProgress
} from "@mui/material";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function DialogVerifikasi({
  open,
  onClose,
  onSubmit,
  type,
  activityName
}) {
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isApprove = type === "setujui";

  // reset state saat dialog ditutup
  useEffect(() => {
    if (!open) {
      setCatatan("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (catatan.trim() === "") {
      setError("Catatan wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      if (onSubmit) {
        await onSubmit(catatan.trim()); // 🔥 tunggu parent
      }

      // ✅ auto close kalau sukses
      if (onClose) onClose();

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      setError("Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose} // 🔒 disable close saat loading
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        {isApprove ? (
          <>
            <CheckCircleOutlined style={{ fontSize: 26, color: "#52c41a" }} />
            Konfirmasi Persetujuan
          </>
        ) : (
          <>
            <CloseCircleOutlined style={{ fontSize: 26, color: "#f5222d" }} />
            Konfirmasi Revisi
          </>
        )}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>


         <Typography variant="body2">
            {isApprove ? (
              <>
                Apakah Anda yakin ingin{" "}
                <span style={{ fontWeight: 700 }}>
                  menyetujui
                </span>{" "}
                aktivitas ini?
              </>
            ) : (
              <>
                Apakah Anda yakin ingin{" "}
                <span style={{ fontWeight: 700 }}>
                  merevisi
                </span>{" "}
                aktivitas ini?
              </>
            )}
          </Typography>

          <TextField
            label="Catatan *"
            multiline
            minRows={3}
            fullWidth
            value={catatan}
            disabled={loading}
            onChange={(e) => {
              setCatatan(e.target.value);
              if (e.target.value.trim() !== "") setError("");
            }}
            error={!!error}
            helperText={error}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Batal
        </Button>

        <Button
          variant="contained"
          color={isApprove ? "success" : "error"}
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {loading
            ? "Menyimpan..."
            : isApprove
            ? "Setujui"
            : "Revisi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}