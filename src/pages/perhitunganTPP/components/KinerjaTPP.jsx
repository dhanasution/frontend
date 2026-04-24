import { Box, Typography, LinearProgress, Stack } from "@mui/material";

const clamp = (v) => Math.max(0, Math.min(100, v));

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n);

/* BULLET STYLE */
const Item = ({ children, color }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: color || "text.secondary",
        flexShrink: 0
      }}
    />
    <Typography variant="body2" color={color || "text.primary"}>
      {children}
    </Typography>
  </Stack>
);

export default function KinerjaTPP({ data, tppDasar = 0, bulan, tahun }) {

  const persenKerja = clamp(Number(data?.persenkerja ?? 0));
  const totalCapaian = Number(data?.totalCapaian ?? 0);
  const targetCapaian = Number(data?.targetCapaian ?? 0);

  const tppKinerja = Number(tppDasar * 0.6);
  const potongan = clamp(100 - persenKerja);

  /* NAMA BULAN */
  const namaBulan = new Intl.DateTimeFormat("id-ID", {
    month: "long"
  }).format(new Date(tahun, bulan - 1));

  return (

    <Box>

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Kinerja ({data?.bobot ?? 60}%)
        </Typography>

        <Typography variant="subtitle1" fontWeight={700}>
          {formatRupiah(tppKinerja)}
        </Typography>
      </Box>

      {/* PROGRESS */}
      <LinearProgress
        variant="determinate"
        value={persenKerja}
        sx={{
          height: 10,
          borderRadius: 99
        }}
      />

      {/* CAPAIAN */}
      <Typography
        variant="body2"
        sx={{ mt: 1, fontWeight: 600 }}
      >
        Capaian Kinerja Bulan {namaBulan} : {Math.round(persenKerja)}%
      </Typography>

      {/* DETAIL */}
      <Stack spacing={0.8} sx={{ mt: 1.5 }}>

        <Item>
          Target Kinerja Bulanan : {totalCapaian} / {targetCapaian}
        </Item>

        <Item color="error.main">
          Potongan Kinerja : {potongan.toFixed(2)}% (
          {formatRupiah(tppKinerja * potongan / 100)})
        </Item>

        <Item>
          Estimasi Kinerja : {formatRupiah(tppKinerja * persenKerja / 100)}
        </Item>

        <Item color="success.main">
          Kontribusi ke TPP : {data?.kontribusi ?? 0}%
        </Item>

      </Stack>

    </Box>
  );
}