import { useState, useEffect, useMemo, useCallback } from 'react';
import axiosInstance from "../../services/axiosInstance";

// material-ui
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// DataGrid
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'components/MainCard';

// icons
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| FORMAT TANGGAL ID ||============================== //
const formatTanggalID = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (isNaN(date)) return value;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// ==============================|| HARI LIBUR MANUAL (FRONTEND FALLBACK) ||============================== //
const HOLIDAYS = {
  '2026-02-16': 'Cuti Bersama Imlek'
};

// ==============================|| COLUMNS ||============================== //
const columns = [
  { field: 'id', headerName: 'No', width: 70, align: 'center', headerAlign: 'center' },
  { field: 'tanggal', headerName: 'Tanggal', width: 180, align: 'center', headerAlign: 'center' },
  { field: 'jam_absen_masuk', headerName: 'Jam Datang', width: 120, align: 'center', headerAlign: 'center' },
  { field: 'jam_absen_keluar', headerName: 'Jam Pulang', width: 120, align: 'center', headerAlign: 'center' },
  { field: 'terlambat_menit', headerName: 'Terlambat Datang', width: 150, align: 'center', headerAlign: 'center' },
  { field: 'cepat_pulang_menit', headerName: 'Cepat Pulang', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'keterangan', headerName: 'Keterangan', width: 200, align: 'center', headerAlign: 'center' }
];

// ==============================|| PAGE ||============================== //
export default function RekapAbsensiBulanan() {
  const theme = useTheme();

  const now = new Date();
  const [bulan, setBulan] = useState(String(now.getMonth() + 1));
  const [tahun, setTahun] = useState(String(now.getFullYear()));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  // ================= FETCH =================

  const fetchRekap = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/rekap/rekap-bulanan", {
        params: { bulan, tahun }
      });

      setData(res.data || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        alert('Session habis / token tidak valid');
      } else {
        alert('Gagal mengambil data');
      }
    } finally {
      setLoading(false);
    }
  }, [bulan, tahun]);





  useEffect(() => {
    fetchRekap();
  }, [fetchRekap]);

  // ================= MAP + SEARCH =================
  const rows = useMemo(() => {
    const mapped = data.map((row, i) => {
      return {
        ...row,
        id: row.id ?? i + 1,
        tanggal: row.tanggal,
        keterangan: row.keterangan || '-'
      };
    });

    if (!search) return mapped;

    const q = search.toLowerCase();
    return mapped.filter((row) =>
      Object.values(row).join(' ').toLowerCase().includes(q)
    );
  }, [data, search]);


  
  // ================= UI =================
  return (
    <MainCard
      title="Rekap Absensi Bulanan"
      content={false}
      sx={{ width: '100%' }}
      secondary={
        <Stack direction="row" spacing={1} alignItems="center">

          {/* BULAN */}
          <TextField
            size="small"
            select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={String(i + 1)}>
                {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
              </MenuItem>
            ))}
          </TextField>

          {/* TAHUN SPINNER */}
          <TextField
            size="small"
            type="number"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            inputProps={{ min: 2020, max: 2100, step: 1 }}
            sx={{ width: 110 }}
          />

          <Button variant="contained" size="small" onClick={fetchRekap}>
            Tampilkan
          </Button>

          {/* SEARCH */}
          <TextField
            size="small"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchOutlined style={{ marginRight: 8 }} />
            }}
            sx={{ minWidth: 220 }}
          />

          {/* EXPORT MENU */}
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => setMenuAnchor(null)}>Export PDF</MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>Export Excel</MenuItem>
          </Menu>
        </Stack>
      }
    >
      <Paper
        sx={{
          height: 480,
          width: '100%',
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 20, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': { backgroundColor: theme.palette.grey[100] },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
            '& .MuiDataGrid-row:hover': { backgroundColor: theme.palette.action.hover }
          }}
        />
      </Paper>
    </MainCard>
  );
}