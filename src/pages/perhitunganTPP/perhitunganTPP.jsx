import { useEffect, useState } from "react";
import { Grid, Divider, Stack, Typography } from "@mui/material";
import axiosInstance from "../../services/axiosInstance"; 

import MainCard from "components/MainCard";

import FilterBulan from "./components/FilterBulan";
import EstimasiTPP from "./components/EstimasiTPP";
import KehadiranTPP from "./components/KehadiranTPP";
import KinerjaTPP from "./components/KinerjaTPP";
import DisiplinKerjaTable from "./components/DisiplinKerjaTable";

export default function PerhitunganTPP() {

  const now = new Date();

  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [data, setData] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {

        const res = await axiosInstance.get("/api/tpp/estimasi", {
          params: { bulan, tahun }
        });

        setData(res.data);

      } catch (err) {
        console.error("TPP ERROR:", err);
        setData(null);
      }
    };

    fetchData();

  }, [bulan, tahun]);

  /* LOADING */
  if (!data) {
    return (
      <MainCard title="Perhitungan TPP">
        <Typography>Memuat data...</Typography>
      </MainCard>
    );
  }

  return (

    <Stack spacing={3}>

      {/* CARD UTAMA */}
      <MainCard
        title="Perhitungan TPP"
        secondary={
          <FilterBulan
            bulan={bulan}
            tahun={tahun}
            setBulan={setBulan}
            setTahun={setTahun}
          />
        }
      >

        <Stack spacing={4}>

          {/* ESTIMASI TPP */}
          <EstimasiTPP
            tppDasar={data.tppDasar}
            nominal={data.estimasiNominal}
            totalPersen={data.totalPersen}
            tppFinal={data.tppFinal}
            tppKehadiran={data.tppKehadiran}
            tppKinerja={data.tppKinerja}
          />

          <Divider />

          {/* ANALISIS TPP */}
          <Grid container spacing={3}>

            <Grid item xs={12} md={6}>
              <KehadiranTPP
                data={data.kehadiran}
                tppDasar={data.tppDasar}
                bulan={bulan}
                tahun={tahun}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <KinerjaTPP
                data={data.kinerja}
                tppDasar={data.tppDasar}
                bulan={bulan}
                tahun={tahun}
              />
            </Grid>

          </Grid>

        </Stack>

      </MainCard>

      {/* CARD DISIPLIN */}
      <MainCard title="Rincian Disiplin Kerja">
        <DisiplinKerjaTable disiplin={data?.disiplin || {}} />
      </MainCard>

    </Stack>

  );
}