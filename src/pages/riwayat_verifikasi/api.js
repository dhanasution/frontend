import axiosInstance from "../../services/axiosInstance";

const ENDPOINT = "/api/riwayat-verifikasi";

// ================= GET RIWAYAT VERIFIKASI =================
export const getRiwayatVerifikasi = async () => {
  const res = await axiosInstance.get(ENDPOINT);
  return res.data?.data || [];
};
