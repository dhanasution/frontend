import { useState, useEffect, useCallback, useMemo } from "react";

import MainCard from "components/MainCard";
import { DataGrid } from "@mui/x-data-grid";

import DialogDetail from "./DialogDetail";
import DialogVerifikasi from "./DialogVerifikasi";
import { getColumns } from "./columns";

import {
  getAktivitasBawahan,
  setujuiAktivitas,
  revisiAktivitas
} from "./api";

import {
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Box
} from "@mui/material";

import { SearchOutlined } from "@ant-design/icons";

export default function VerifikasiAktivitas() {

  const token = localStorage.getItem("token");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pegawaiFilter, setPegawaiFilter] = useState("ALL");
  const [tanggalFilter, setTanggalFilter] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  /* dialog verifikasi */

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= LOAD DATA ================= */

  const fetchData = useCallback(async () => {

    try {

      setLoading(true);

      const data = await getAktivitasBawahan(token);
      console.log("DATA API:", data);

      const mapped = (data || []).map((item, index) => ({

        id: item.id,
        no: index + 1,

        tanggal: item.tanggal
          ? new Date(item.tanggal).toLocaleDateString("id-ID")
          : "-",

        nip: item.nip ?? "-",

        nama: item.nama ?? "-",
        aktivitas: item.nama_kegiatan ?? "-",

        kategori: item.kategori ?? "-",
        lokasi: item.lokasi ?? "-",

        durasi: item.durasi ?? 0,

        status: String(item.status ?? "")
          .toLowerCase()
          .trim(),

        deskripsi: item.deskripsi ?? "",
        link_bukti: item.link_bukti ?? ""

      }));

      setRows(mapped);

    } catch (err) {

      console.error("FETCH ERROR:", err);

    } finally {

      setLoading(false);

    }

  }, [token]);

  // Reload Setiap 60 detik
  useEffect(() => {

    fetchData(); // pertama load

    const interval = setInterval(() => {
      console.log("AUTO REFRESH...");
      fetchData();
    }, 60000); 

    return () => clearInterval(interval);

  }, [fetchData]);

  /* ================= ACTION ================= */

  const handleSetujui = (id) => {

    setSelectedId(id);
    setDialogType("setujui");
    setDialogOpen(true);

  };

  const handleRevisi = (id) => {

    setSelectedId(id);
    setDialogType("revisi");
    setDialogOpen(true);

  };

const handleSubmitDialog = async (catatan) => {
  try {

    if (!selectedId) {
      console.error("ID kosong!");
      return;
    }

    if (dialogType === "setujui") {

      await setujuiAktivitas(selectedId, token, {
        catatan: catatan // masuk ke kolom catatan
      });

    } else {

      await revisiAktivitas(selectedId, token, {
        catatan_revisi: catatan // masuk ke kolom catatan_revisi
      });

    }

    setDialogOpen(false);
    fetchData();

  } catch (err) {

    console.error("VERIFIKASI ERROR:", err);

  }
};

  const openDetail = (row) => {

    setSelectedActivity(row);
    setDetailOpen(true);

  };

  /* ================= FILTER LIST ================= */

  const pegawaiList = useMemo(() => {

    return [...new Set(rows.map((r) => r.nama))];

  }, [rows]);

  /* ================= FILTER ================= */

  const filteredRows = useMemo(() => {

    const q = (search || "").toLowerCase();

    return rows.filter((row) => {

      const nama = (row.nama || "").toLowerCase();
      const aktivitas = (row.aktivitas || "").toLowerCase();
      const kategori = (row.kategori || "").toLowerCase();

      const matchSearch =
        nama.includes(q) ||
        aktivitas.includes(q) ||
        kategori.includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        row.status === statusFilter;

      const matchPegawai =
        pegawaiFilter === "ALL" ||
        row.nama === pegawaiFilter;

      const matchTanggal =
        !tanggalFilter ||
        row.tanggal ===
          new Date(tanggalFilter).toLocaleDateString("id-ID");

      return (
        matchSearch &&
        matchStatus &&
        matchPegawai &&
        matchTanggal
      );

    });

  }, [rows, search, statusFilter, pegawaiFilter, tanggalFilter]);

  /* ================= TABLE ================= */

  const columns = getColumns(
    openDetail,
    handleSetujui,
    handleRevisi
  );

  /* ================= RENDER ================= */

  return (

    <MainCard
      title="Verifikasi Aktivitas Bawahan"
      secondary={

        <Stack direction="row" spacing={1}>

          <TextField
            size="small"
            placeholder="Cari aktivitas..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <SearchOutlined/>
                </InputAdornment>
              )
            }}
          />

          

          <FormControl size="small">

            <Select
              value={pegawaiFilter}
              onChange={(e)=>setPegawaiFilter(e.target.value)}
            >

              <MenuItem value="ALL">
                Semua Pegawai
              </MenuItem>

              {pegawaiList.map((nama)=>(
                <MenuItem key={nama} value={nama}>
                  {nama}
                </MenuItem>
              ))}

            </Select>

          </FormControl>

          <TextField
            type="date"
            size="small"
            value={tanggalFilter}
            onChange={(e)=>setTanggalFilter(e.target.value)}
          />

        </Stack>

      }
    >

      <Box sx={{ height:540 }}>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5,10,20,50]}
          initialState={{
            pagination:{
              paginationModel:{ pageSize:10 }
            }
          }}
        />

      </Box>

      <DialogDetail
        open={detailOpen}
        onClose={()=>setDetailOpen(false)}
        activity={selectedActivity}
      />

      <DialogVerifikasi
        open={dialogOpen}
 
        type={dialogType}
        onClose={()=>setDialogOpen(false)}
        onSubmit={handleSubmitDialog}
      />

    </MainCard>

  );

}