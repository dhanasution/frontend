import { useEffect, useState, useCallback } from "react";

// MUI
import {
  Avatar,
  Grid,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Paper
} from "@mui/material";

import {
  Assignment,
  HourglassEmpty,
  CheckCircle,
  Cancel
} from "@mui/icons-material";

// API
import { getProfile, getDashboardStats } from "./dashboardService";

export default function DashboardDefault() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    menunggu: 0,
    disetujui: 0,
    ditolak: 0,
    total: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    if (!token) {
      setError("Token tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [profileRes, statsRes] = await Promise.all([
        getProfile(token),
        getDashboardStats(token)
      ]);

      // ✅ HANDLE SEMUA FORMAT RESPONSE
      const profileData =
        profileRes?.data?.data || profileRes?.data || null;

      if (!profileData) throw new Error("Profile kosong");

      setUser(profileData);

      const statsData =
        statsRes?.data?.data || statsRes?.data || {};

      setStats({
        menunggu: statsData?.menunggu ?? 0,
        disetujui: statsData?.disetujui ?? 0,
        ditolak: statsData?.ditolak ?? 0,
        total: statsData?.total ?? 0
      });

    } catch (err) {
      console.error("ERROR DASHBOARD:", err);
      setError("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ✅ DEBUG
  useEffect(() => {
    if (user) {
      console.log("USER FINAL:", user);
    }
  }, [user]);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: "1400px", px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>

            {loading ? (
              <Box
                sx={{
                  height: 110,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <WelcomeCard user={user} />
            )}

          </Grid>

          <Grid item xs={12}>
            <Paper sx={statsWrapperStyle}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Statistik Aktivitas
              </Typography>

              <Grid container spacing={3}>
                {loading ? (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        height: 150,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </Grid>
                ) : (
                  <StatsCards2 stats={stats} />
                )}



              </Grid>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}

// ================= COMPONENT =================

// ✅ FALLBACK MAP (ANTI GAGAL TOTAL)
const kategoriMap = {
  1: "PNS",
  2: "PPPK Full Waktu",
  3: "PPPK Paruh Waktu"
};

function WelcomeCard({ user }) {

  // PRIORITAS: nama dari backend → fallback ke map ID
  const kategoriLabel =
    user?.kategori_pegawai ??
    kategoriMap[user?.kategori_pegawai_id] ??
    "Tidak diketahui";

  return (
    <Paper sx={welcomeStyle}>
      
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={avatarStyle}>
          {user?.nama?.charAt(0) || "U"}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={nameStyle}>
            Selamat Datang, {user?.nama?.toUpperCase()|| "USER"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            NIP: {user?.nip || "-"} / {user?.nama_opd || "-"} 
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flexShrink: 0 }}>
        <Chip
          label={kategoriLabel}
          color="primary"
          sx={chipStyle}
        />
      </Box>

    </Paper>
  );
}

function StatsCards2({ stats }) {
  const items = [
    {
      title: "Aktivitas Total Bulan Ini",
      value: stats.total,
      icon: <Assignment />,
      bg: "#e3f2fd",
      color: "#1976d2"
    },
    {
      title: "Aktivitas Disetujui Bulan Ini",
      value: stats.disetujui,
      icon: <CheckCircle />,
      bg: "#f3e5f5",
      color: "#7b1fa2"
    },
    {
      title: "Aktivitas Menunggu Verifikasi",
      value: stats.menunggu,
      icon: <HourglassEmpty />,
      bg: "#e8f5e9",
      color: "#2e7d32"
    },
    {
      title: "Aktivitas Ditolak",
      value: stats.ditolak,
      icon: <Cancel />,
      bg: "#fff3e0",
      color: "#ef6c00"
    }
  ];

  return (
    <>
      {items.map((item, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          
          {/* Wrapper biar center */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                bgcolor: item.bg,
                width: 250, 
                maxWidth: "100%",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 4
                }
              }}
            >
              <Box sx={{ color: item.color, fontSize: 42, mb: 1 }}>
                {item.icon}
              </Box>

              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: item.color }}
              >
                {item.value}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: item.color, mt: 0.5 }}
              >
                {item.title}
              </Typography>
            </Paper>
          </Box>

        </Grid>
      ))}
    </>
  );
}

// ================= STYLE =================

const statsWrapperStyle = {
  width: 1400,
  maxWidth: "100%",
  mx: "auto",
  p: { xs: 2, sm: 3 },
  borderRadius: 3,
  bgcolor: "background.paper",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  }
};

const welcomeStyle = {
  width: 1400,
  maxWidth: "100%",
  p: 3,
  borderRadius: 3,
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 2,
  bgcolor: "background.paper",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  }
};

const avatarStyle = {
  width: { xs: 45, sm: 55, md: 65 },
  height: { xs: 45, sm: 55, md: 65 },
  bgcolor: "primary.main",
  fontWeight: "bold",
  fontSize: 22
};

const nameStyle = {
  fontWeight: 600,
  fontSize: { xs: 14, sm: 16, md: 18 },
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

const chipStyle = {
  fontWeight: 600,
  mt: { xs: 1, sm: 0 }
};