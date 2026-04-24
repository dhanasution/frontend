import PropTypes from "prop-types";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Paper,
  Button,
  Box,
  Link
} from "@mui/material";

import StatusChip from "./StatusChip";
import InfoItem from "./InfoItem";

export default function DialogDetail({ open, onClose, activity }) {

  if (!activity) return null;

  const {
    tanggal,
    nip,
    nama_bawahan,
    aktivitas,
    kategori,
    lokasi,
    deskripsi,
    link_bukti,
    durasi,
    status,
    catatan
  } = activity;

  const isImage =
    link_bukti && /\.(jpg|jpeg|png|webp)$/i.test(link_bukti);

  return (

    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

      <DialogTitle sx={{ fontWeight: 600 }}>
        Detail Aktivitas
      </DialogTitle>

      <DialogContent dividers>

        <Stack spacing={2}>

          {/* TANGGAL */}
          <InfoItem label="Tanggal" value={tanggal || "-"} />

          {/* NAMA + DURASI */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <InfoItem label="Nama Pegawai" value={nama_bawahan || "-"} />
            <InfoItem label="Durasi" value={durasi ? `${durasi} Jam` : "-"} />
          </Stack>

          {/* NIP */}
          <InfoItem label="NIP" value={nip || "-"} />

          {/* AKTIVITAS */}
          <InfoItem label="Aktivitas" value={aktivitas || "-"} />

          {/* KATEGORI + LOKASI */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <InfoItem label="Kategori" value={kategori || "-"} />
            <InfoItem label="Lokasi" value={lokasi || "-"} />
          </Stack>

          {/* KETERANGAN */}
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Keterangan
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2
              }}
            >
              <Typography variant="body2">
                {deskripsi || "-"}
              </Typography>
            </Paper>
          </Stack>

          {/* BUKTI */}
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Bukti
            </Typography>

            {!link_bukti ? (
              <Typography variant="body2" color="text.secondary">
                Tidak ada bukti
              </Typography>
            ) : (
              <Stack spacing={1}>

                {/* PREVIEW GAMBAR */}
                {isImage && (
                  <Box
                    component="img"
                    src={link_bukti}
                    alt="Bukti aktivitas"
                    sx={{
                      width: 200,
                      maxHeight: 150,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider"
                    }}
                  />
                )}

                {/* LINK FILE */}
                <Link
                  href={link_bukti}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                >
                  {link_bukti}
                </Link>

              </Stack>
            )}
          </Stack>

          {/* STATUS */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Status</Typography>
            <StatusChip value={status} />
          </Stack>

          {/* CATATAN */}
          {catatan && (
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Catatan
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 2
                }}
              >
                <Typography variant="body2">
                  {catatan}
                </Typography>
              </Paper>
            </Stack>
          )}

        </Stack>

      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>

    </Dialog>

  );

}

DialogDetail.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  activity: PropTypes.object
};