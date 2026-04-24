import { Chip } from "@mui/material";

export default function StatusChip({ value }) {
  const map = {
    dikirim: { label: "Menunggu", color: "warning" },
    disetujui: { label: "Disetujui", color: "success" },
    direvisi: { label: "Direvisi", color: "error" }
  };

  const s = map[value] || { label: value, color: "default" };

  return <Chip label={s.label} color={s.color} size="small" />;
}