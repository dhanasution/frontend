import { Button, Stack } from "@mui/material";

import StatusBadge from "./components/StatusBadge";
import HapusAktivitasModal from "./HapusAktivitasModal";
import KirimAktivitasModal from "./KirimAktivitasModal";

export const getColumns = (
  onDetail,
  onEdit,
  onDelete,
  onKirim
) => [
  {
    field: "tanggal",
    headerName: "Tanggal",
    width: 130
  },
  {
    field: "nama_kegiatan",
    headerName: "Nama Kegiatan",
    flex: 1
  },
  {
    field: "kategori",
    headerName: "Kategori",
    width: 150
  },
  {
    field: "lokasi",
    headerName: "Lokasi",
    width: 150
  },
  {
    field: "durasi",
    headerName: "Durasi",
    width: 110,
    renderCell: (params) => {
      const durasi = params.value || 0;
      return `${durasi} Jam`;
    }
  },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    renderCell: (params) => (
      <StatusBadge status={params.value} />
    )
  },
  {
    field: "aksi",
    headerName: "Aksi",
    width: 320,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {

      const data = params.row;

      const status = (data.status || "")
        .toLowerCase()
        .trim();

      // 🔥 kondisi editable
      const isEditable =
        status === "draft" ||
        status === "ditolak" ||
        status === "direvisi";

      return (
        
        <Stack
          direction="row"
          spacing={1}
          //justifyContent="center"   
          alignItems="center"       
          sx={{
            width: "100%",
            height: "100%",
            display: "flex"
          }}
        >
          {/* DETAIL (selalu ada) */}
          <Button
            size="small"
            variant="outlined"
            onClick={() => onDetail(data)}
          >
            Detail
          </Button>

          {/* EDIT (draft, ditolak, revisi) */}
          {isEditable && (
            <Button
              size="small"
              variant="contained"
              onClick={() => onEdit(data)}
            >
              Edit
            </Button>
          )}

          {/* DELETE (hanya draft) */}
          {status === "draft" && (
            <HapusAktivitasModal
              activityName={data.nama_kegiatan}
              onConfirm={() => onDelete(data.id)}
            />
          )}

          {/* KIRIM (hanya final) */}
          {status === "final" && (
            <KirimAktivitasModal
              activityName={data.nama_kegiatan}
              onConfirm={() => onKirim(data)}
            />
          )}

        </Stack>
      );
    }
  }
];