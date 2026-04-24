import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

import { columns } from './columns';
import SummaryTable from './SummaryTable';
import useRekapAbsensi from './useRekapAbsensi';

export default function RekapAbsensiBulanan() {
  const theme = useTheme();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const {
    bulan,
    setBulan,
    tahun,
    setTahun,
    search,
    setSearch,
    loading,
    rows,
    summary,
    fetchRekap
  } = useRekapAbsensi();
  //(API_URL);

  useEffect(() => {
    fetchRekap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainCard
      title="Rekap Absensi Bulanan"
      content={false}
      sx={{ width: '100%' }}
      secondary={
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          
          {/* BULAN */}
          <TextField
            size="small"
            select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
          >
            <MenuItem value="1">Januari</MenuItem>
            <MenuItem value="2">Februari</MenuItem>
            <MenuItem value="3">Maret</MenuItem>
            <MenuItem value="4">April</MenuItem>
            <MenuItem value="5">Mei</MenuItem>
            <MenuItem value="6">Juni</MenuItem>
            <MenuItem value="7">Juli</MenuItem>
            <MenuItem value="8">Agustus</MenuItem>
            <MenuItem value="9">September</MenuItem>
            <MenuItem value="10">Oktober</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">Desember</MenuItem>
          </TextField>

          {/* TAHUN */}
          <TextField
            size="small"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            sx={{ width: 100 }}
          />

          {/* BUTTON TAMPILKAN */}
          <Button
            size="small"
            variant="contained"
            onClick={fetchRekap}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Tampilkan'}
          </Button>

          {/* SEARCH */}
          <TextField
            size="small"
            placeholder="Cari tanggal / keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />

          {/* MENU EXPORT */}
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => setMenuAnchor(null)}>Export PDF</MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>Export Excel</MenuItem>
          </Menu>
        </Stack>
      }
    >

      {/* DATA GRID */}
      <Paper
        sx={{
          width: '100%',
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          disableRowSelectionOnClick
          sx={{
            border: 0,

            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.grey[100]
            },

            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              fontSize: '0.875rem'
            },

            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center'
            },

            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        />
      </Paper>

      {/* SUMMARY */}
      <Box sx={{ mt: 1 }}>
        <SummaryTable summary={summary} theme={theme} />
      </Box>

    </MainCard>
  );
}