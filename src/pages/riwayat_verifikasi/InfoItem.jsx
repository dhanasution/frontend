import { Stack, Typography } from "@mui/material";

export default function InfoItem({ label, value }) {
  return (
    <Stack spacing={0.2} sx={{ minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600}>
        {value || "-"}
      </Typography>
    </Stack>
  );
}