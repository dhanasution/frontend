import { Button, Chip, Stack } from "@mui/material";

export const getColumns = (openDetail) => [

  { field: "no", headerName: "No", width: 70 },

  {
    field: "tanggal",
    headerName: "Tanggal",
    width: 160
  },

  {
    field: "nip",
    headerName: "NIP",
    width: 160
  },

  {
    field: "nama_bawahan",
    headerName: "Nama Bawahan",
    width: 220
  },

  {
    field: "aktivitas",
    headerName: "Nama Aktivitas",
    flex: 1,
    minWidth: 250
  },

  {
    field: "status",
    headerName: "Status",
    width: 140,
    renderCell: (params) => {

      const map = {
        disetujui: { label: "Disetujui", color: "success" },
        ditolak: { label: "Ditolak", color: "error" }
      };

      const s = map[params.value] || {
        label: params.value,
        color: "default"
      };

      return (
        <Chip
          label={s.label}
          color={s.color}
          size="small"
        />
      );

    }
  },

  {
    field: "catatan",
    headerName: "Catatan",
    flex: 1,
    minWidth: 250
  },

  {
    field: "aksi",
    headerName: "Aksi",
    width: 140,
    align: "center",
    headerAlign: "center",

    renderCell: (params) => (

      <Stack direction="row" spacing={1}>

        <Button
          size="small"
          variant="outlined"
          onClick={() => openDetail(params.row)}
        >
          Detail
        </Button>

      </Stack>

    )
  }

];