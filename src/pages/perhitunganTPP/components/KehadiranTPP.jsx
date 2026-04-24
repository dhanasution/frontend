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

export default function KehadiranTPP({ data, tppDasar = 0, bulan, tahun }) {

  const persenBersih = clamp(Number(data?.persenBersih ?? 0));
  console.log("DATA KEHADIRAN:", data);
  console.log("PERSEN BERSIH:", persenBersih);
  
  const tppKehadiran = Number(tppDasar * 0.4);
  const potongan = Number(data?.potonganDisiplin ?? 0);

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
          Kehadiran ({data?.bobot ?? 40}%)
        </Typography>

        <Typography variant="subtitle1" fontWeight={700}>
          {formatRupiah(tppKehadiran)}
        </Typography>
      </Box>

      {/* PROGRESS */}
      <LinearProgress
        variant="determinate"
        value={persenBersih}
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
        Capaian Kehadiran Bulan {namaBulan} : {Math.round(persenBersih)}%
      </Typography>

      {/* DETAIL */}
      <Stack spacing={0.8} sx={{ mt: 1.5 }}>

        <Item>
          Hari Kerja : {data?.hadir ?? 0} / {data?.hariKerja ?? 0}
        </Item>

        <Item color="error.main">
          Potongan Disiplin : {potongan}% (
          {formatRupiah(tppKehadiran * potongan / 100)})
        </Item>

        <Item>
          Estimasi Kehadiran : {formatRupiah(tppKehadiran * persenBersih / 100)}
        </Item>

        <Item>
          Persentase Kehadiran Bersih : {persenBersih}%
        </Item>

        <Item color="success.main">
          Kontribusi ke TPP : {data?.kontribusi ?? 0}%
        </Item>

      </Stack>

    </Box>
  );
}