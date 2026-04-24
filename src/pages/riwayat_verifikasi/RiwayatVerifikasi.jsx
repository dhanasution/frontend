import { useState, useEffect, useCallback, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "components/MainCard";

import { getRiwayatVerifikasi } from "./api";
import { getColumns } from "./columns";

import {
  Stack,
  TextField,
  InputAdornment,
  Box,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";

import { SearchOutlined } from "@ant-design/icons";

import DialogDetail from "./DialogDetail";

export default function RiwayatVerifikasi() {

  const token = localStorage.getItem("token");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pegawaiFilter, setPegawaiFilter] = useState("ALL");
  const [tanggalFilter, setTanggalFilter] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = useCallback(async () => {

    try {

      setLoading(true);

      const data = await getRiwayatVerifikasi(token);

      const mapped = (data || []).map((item, index) => {

        const status = String(item.status ?? "").toLowerCase().trim();

        return {

          id: item.id,
          no: index + 1,

          tanggal: item.tanggal
            ? new Date(item.tanggal).toLocaleDateString("id-ID")
            : "-",

          nip: item.nip ?? "-",
          nama_bawahan: item.nama_bawahan ?? "-",
          aktivitas: item.nama_kegiatan ?? "-",
          kategori: item.kategori ?? "-",

          lokasi: item.lokasi ?? "-",

          durasi: item.durasi ?? "-",
          status,

          catatan:
            status === "ditolak"
              ? item.catatan_penolakan ?? "-"
              : item.catatan ?? "-",

          deskripsi: item.deskripsi ?? "",
          link_bukti: item.link_bukti ?? ""

        };

      });

      setRows(mapped);

    } catch (err) {

      console.error("FETCH RIWAYAT ERROR:", err);

    } finally {

      setLoading(false);

    }

  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pegawaiList = useMemo(() => {

    return [...new Set(rows.map((r) => r.nama_bawahan))];

  }, [rows]);

  const filteredRows = useMemo(() => {

    const q = search.toLowerCase();

    return rows.filter((row) => {

      const matchSearch =
        row.nama_bawahan.toLowerCase().includes(q) ||
        row.aktivitas.toLowerCase().includes(q) ||
        row.nip.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        row.status === statusFilter;

      const matchPegawai =
        pegawaiFilter === "ALL" ||
        row.nama_bawahan === pegawaiFilter;

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

  const openDetail = (row) => {

    setSelectedRow(row);
    setDetailOpen(true);

  };

  const columns = getColumns(openDetail);

  return (

    <MainCard
      title="Riwayat Verifikasi Aktivitas"
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
              value={statusFilter}
              onChange={(e)=>setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">Semua Status</MenuItem>
              <MenuItem value="disetujui">Disetujui</MenuItem>
              <MenuItem value="ditolak">Ditolak</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={pegawaiFilter}
              onChange={(e)=>setPegawaiFilter(e.target.value)}
            >
              <MenuItem value="ALL">Semua Pegawai</MenuItem>

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
        activity={selectedRow}
      />

    </MainCard>

  );

}