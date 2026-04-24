import { Box, Typography, LinearProgress } from "@mui/material";

const clamp = (v) => Math.max(0, Math.min(100, v));

export default function EstimasiTPP({
  tppDasar = 0,
  nominal = 0,
  tppFinal = 0,
  totalPersen = 0
}) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4">
        TPP Dasar : Rp {Number(tppDasar).toLocaleString("id-ID")},-
      </Typography>

      <Typography variant="body2">Estimasi TPP</Typography>

      <Typography variant="h4" fontWeight={900}>
        Rp. {Number(nominal).toLocaleString("id-ID")},-
      </Typography>

      <Box sx={{ mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={clamp(totalPersen)}
          sx={{ height: 10, borderRadius: 99 }}
        />
        <Typography variant="caption">
          {Math.round(totalPersen)}%
        </Typography>
      </Box>
    </Box>
  );
}