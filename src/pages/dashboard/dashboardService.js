import axiosInstance from "../../services/axiosInstance";

// ================= GET PROFILE =================
export const getProfile = async () => {
  const res = await axiosInstance.get("/api/users/profile");
  return res.data;
};

// ================= DASHBOARD =================
export const getDashboardStats = async () => {
  const res = await axiosInstance.get("/api/dashboard");
  return res.data;
};