import { Chip } from "@mui/material";

export default function StatusBadge({ status }) {

  const value = String(status || "").toLowerCase();

  const map = {

    draft: {
      label: "Draft",
      color: "warning"
    },

    final: {
      label: "Final",
      color: "info"
    },

    dikirim: {
      label: "Dikirim",
      color: "primary"
    },

    disetujui: {
      label: "Disetujui",
      color: "success"
    },

    ditolak: {
      label: "Ditolak",
      color: "error"
    }

  };

  const item = map[value] || {
    label: value || "-",
    color: "default"
  };

  return (
    <Chip
      label={item.label}
      color={item.color}
      size="small"
      variant="filled"
    />
  );
}