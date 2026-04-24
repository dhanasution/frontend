/* ==========================================================================
API SERVICE: AKTIVITAS
Deskripsi: Modul ini menangani semua permintaan HTTP terkait aktivitas, 
           termasuk mengambil data bawahan, verifikasi (setujui/revisi), 
           dan pengiriman aktivitas.
========================================================================== */

import axiosInstance from "../../services/axiosInstance";

/* ================= BASE ENDPOINT ================= */

const ENDPOINT = "/api/aktivitas";

/* ================= AKTIVITAS BAWAHAN ================= */

export const getAktivitasBawahan = async () => {
  try {
    const res = await axiosInstance.get(`${ENDPOINT}/bawahan/list`);
    return res.data?.data || [];
  } catch (err) {
    console.error("GET AKTIVITAS ERROR:", err.response?.data || err.message);
    throw err;
  }
};

/* ================= SETUJUI ================= */

export const setujuiAktivitas = async (id, data) => {
  try {
    const res = await axiosInstance.put(
      `${ENDPOINT}/verifikasi/${id}`,
      {
        status: "disetujui",
        catatan: data?.catatan || null
      }
    );

    console.log("SETUJUI RESPONSE:", res.data);
    return res.data;
  } catch (err) {
    console.error("SETUJUI ERROR:", err.response?.data || err.message);
    throw err;
  }
};

/* ================= REVISI ================= */

export const revisiAktivitas = async (id, data) => {
  try {
    const res = await axiosInstance.put(
      `${ENDPOINT}/verifikasi/${id}`,
      {
        status: "direvisi",
        catatan_revisi: data?.catatan_revisi || null
      }
    );

    console.log("REVISI RESPONSE:", res.data);
    return res.data;
  } catch (err) {
    console.error("REVISI ERROR:", err.response?.data || err.message);
    throw err;
  }
};

/* ================= KIRIM ================= */

export const kirimAktivitas = async (id) => {
  try {
    const res = await axiosInstance.put(`${ENDPOINT}/${id}/kirim`, {});
    return res.data;
  } catch (err) {
    console.error("KIRIM ERROR:", err.response?.data || err.message);
    throw err;
  }
};