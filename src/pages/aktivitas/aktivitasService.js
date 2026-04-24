import axiosInstance from "../../services/axiosInstance";

/* ================= GET AKTIVITAS ================= */
export const getAktivitas = async () => {
  const res = await axiosInstance.get("/api/aktivitas");
  return res;
};

/* ================= TAMBAH AKTIVITAS ================= */
export const tambahAktivitas = async (data) => {
  const res = await axiosInstance.post("/api/aktivitas", data);
  return res;
};

/* ================= UPDATE AKTIVITAS ================= */
export const updateAktivitas = async (id, data) => {
  const res = await axiosInstance.put(`/api/aktivitas/${id}`, data);
  return res;
};

/* ================= DELETE AKTIVITAS ================= */
export const deleteAktivitas = async (id) => {
  const res = await axiosInstance.delete(`/api/aktivitas/${id}`);
  return res;
};

/* ================= KIRIM AKTIVITAS ================= */
export const kirimAktivitas = async (id) => {
  const res = await axiosInstance.put(`/api/aktivitas/${id}/kirim`);
  return res;
};

/* ================= FINAL AKTIVITAS ================= */
export const finalAktivitas = async (id) => {
  const res = await axiosInstance.put(`/api/aktivitas/${id}/final`);
  return res;
};

/* ================= AKTIVITAS BAWAHAN ================= */
export const getAktivitasBawahan = async () => {
  const res = await axiosInstance.get("/api/aktivitas/bawahan");
  return res;
};

/* ================= SETUJUI ================= */
export const setujuiAktivitas = async (id) => {
  const res = await axiosInstance.put(`/api/aktivitas/${id}/setujui`);
  return res;
};

/* ================= TOLAK ================= */
export const tolakAktivitas = async (id, catatan) => {
  const res = await axiosInstance.put(`/api/aktivitas/${id}/tolak`, {
    catatan
  });
  return res;
};