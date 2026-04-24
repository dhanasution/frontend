import { Stack, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import StatusChip from "./StatusChip";

export const getColumns = (openDetail, handleSetujui, handleRevisi) => [

  { field: "no", headerName: "No", width: 70 },

  { field: "tanggal", headerName: "Tanggal", width: 130 },

  { field: "nip", headerName: "NIP", width: 180 },

  { field: "nama", headerName: "Nama Pegawai", flex: 1 },

  { field: "aktivitas", headerName: "Aktivitas", flex: 2 },

  { field: "durasi", headerName: "Durasi", width: 100 },

  {
    field: "status",
    headerName: "Status",
    width: 140,
    renderCell: (params) => <StatusChip value={params.value} />
  },

  {
    field: "aksi",
    headerName: "Aksi",
    width: 300,
    sortable: false,
    filterable: false,
    headerAlign: "center", 
    align: "center",
    renderCell: (params) => {

      if (params.row.status !== "dikirim") return "-";

      return (
        <Stack 
          direction="row" 
          spacing={1}
          justifyContent="center"   
          alignItems="center"       
          sx={{ width: "100%", height: "100%" }} 
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => openDetail(params.row)}
          >
            Detail
          </Button>

          <Button
            size="small"
            color="success"
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={() => handleSetujui(params.row.id)}
          >
            Setujui
          </Button>

          <Button
            size="small"
            color="error"
            variant="contained"
            startIcon={<CloseIcon />}
            onClick={() => handleRevisi(params.row.id)}
          >
            Revisi
          </Button>

        </Stack>
      );
    }
  }
];