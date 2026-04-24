import { useEffect, useState, useCallback } from "react";

// MUI
import {
  Avatar,
  Grid,
  Typography,
  Stack,
  Box,
  Skeleton,
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
      console.error(err);
      setError("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: "1400px", px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>

          {/* ERROR */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {/* WELCOME */}
          <Grid item xs={12}>
            {loading ? (
              <Skeleton variant="rounded" height={110} />
            ) : (
              <WelcomeCard user={user} />
            )}
          </Grid>

          {/* STATISTIK MODERN */}
          <Grid item xs={12}>
            <Paper sx={statsWrapperStyle}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Statistik Aktivitas
              </Typography>

              <Grid container spacing={3}>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Grid item xs={12} sm={6} md={3} key={i}>
                        <Skeleton variant="rounded" height={120} />
                      </Grid>
                    ))
                  : <StatsCards2 stats={stats} />}
              </Grid>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}

// ================= COMPONENT =================

function WelcomeCard({ user }) {
  return (
    <Paper sx={welcomeStyle}>
      
      {/* LEFT SIDE */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={avatarStyle}>
          {user?.nama?.charAt(0) || "U"}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={nameStyle}>
            Selamat Datang, {user?.nama?.toUpperCase()}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            NIP: {user?.nip || "-"}
          </Typography>
        </Box>
      </Stack>

      {/* RIGHT SIDE (FIX DI UJUNG) */}
      <Box sx={{ flexShrink: 0 }}>
        <Chip
          label={user?.role || "User"}
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
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3
      }}
    >
      {items.map((item, i) => (
        <Box
          key={i}
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(25% - 18px)" 
            }
          }}
        >
          <Paper
            sx={{
              p: 1,
              borderRadius: 3,

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              minHeight: 140,

              bgcolor: item.bg,
              height: "100%",
              width: 300,         
              maxWidth: "100%",

              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3
              }
            }}
          >


            <Box sx={{ color: item.color, fontSize: 40, mb: 1 }}>
              {item.icon}
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: item.color }}
            >
              {item.value}
            </Typography>

            <Typography variant="body2" sx={{ color: item.color }}>
              {item.title}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

// ================= STYLE =================




const statsWrapperStyle = {
  width: 1400,         
  maxWidth: "100%",     // kunci lebar
  mx: "auto",             // center

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