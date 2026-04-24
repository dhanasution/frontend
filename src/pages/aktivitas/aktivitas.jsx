import { useState, useEffect, useMemo } from "react";

import MainCard from "components/MainCard";
import AktivitasTable from "./AktivitasTable";
import { getColumns } from "./columns";

import {
  getAktivitas,
  tambahAktivitas,
  updateAktivitas,
  deleteAktivitas,
  kirimAktivitas
} from "./aktivitasService";

import TambahAktivitasModal from "./TambahAktivitasModal";
import EditAktivitasModal from "./EditAktivitasModal";
import DetailAktivitasModal from "./DetailAktivitasModal";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Menu
} from "@mui/material";

import {
  PlusOutlined,
  SearchOutlined,
  EllipsisOutlined
} from "@ant-design/icons";

export default function AktivitasPage() {

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [menuAnchor, setMenuAnchor] = useState(null);

  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedData, setSelectedData] = useState(null);

  /* ================= LOAD DATA ================= */

  const loadData = async () => {

    try {

      const res = await getAktivitas();

      const dataArray = res?.data?.data || [];
      console.log("DATA BACKEND:", dataArray);

      const mapped = dataArray.map((item) => ({
        id: item.id,
        tanggal: item.tanggal
        ? new Date(item.tanggal).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
          })
        : "-",
        nama_kegiatan: item.nama_kegiatan ?? "-",
        kategori: item.kategori ?? "-",
        lokasi: item.lokasi ?? "-",
        durasi: item.durasi ?? 0,
        status: String(item.status ?? "draft").toLowerCase().trim(),
        deskripsi: item.deskripsi ?? "",
        link_bukti: item.link_bukti ?? ""
      }));

      setRows(mapped);

    } catch (err) {

      console.error("LOAD DATA ERROR:", err);

    }

  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ACTION ================= */

  const handleDetail = (row) => {
    setSelectedData(row);
    setOpenDetail(true);
  };

  const handleEdit = (row) => {
    setSelectedData(row);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {

    try {

      await deleteAktivitas(id);
      await loadData();

    } catch (err) {

      console.error("DELETE ERROR:", err);

    }

  };

  const handleKirim = async (row) => {

    try {

      await kirimAktivitas(row.id);
      await loadData();

    } catch (err) {

      console.error("KIRIM ERROR:", err);

    }

  };

  /* ================= TAMBAH ================= */

  const handleTambah = async (data) => {

    try {

      const res = await tambahAktivitas(data);

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Gagal menyimpan");
      }

      await loadData();

      return {
        success: true,
        message: "Aktivitas berhasil disimpan"
      };

    } catch (err) {

      return {
        success: false,
        message:
          err?.response?.data?.message ||
          err.message ||
          "Gagal menyimpan aktivitas"
      };

    }

  };

  /* ================= UPDATE ================= */

  const handleUpdate = async (data) => {

    try {

      const res = await updateAktivitas(data.id, data);

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Gagal update aktivitas");
      }

      await loadData();

      setOpenEdit(false);
      setSelectedData(null);

      return {
        success: true,
        message: "Aktivitas berhasil diperbaharui"
      };

    } catch (err) {

      return {
        success: false,
        message:
          err?.response?.data?.message ||
          "Gagal memperbaharui aktivitas"
      };

    }

  };

  /* ================= FILTER ================= */

  const filteredRows = useMemo(() => {

    const q = (search || "").toLowerCase();

    return rows.filter((row) => {

      const nama = (row.nama_kegiatan || "").toLowerCase();
      const kategori = (row.kategori || "").toLowerCase();
      const lokasi = (row.lokasi || "").toLowerCase();

      const matchSearch =
        nama.includes(q) ||
        kategori.includes(q) ||
        lokasi.includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        row.status === statusFilter;

      return matchSearch && matchStatus;

    });

  }, [rows, search, statusFilter]);

  /* ================= EXPORT PDF ================= */

  const exportPDF = () => {

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text("LAPORAN AKTIVITAS PEGAWAI", 148, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(
      `Tanggal Cetak : ${new Date().toLocaleDateString("id-ID")}`,
      14,
      25
    );

    autoTable(doc, {
      startY: 35,
      head: [[
        "No",
        "Tanggal",
        "Kegiatan",
        "Kategori",
        "Lokasi",
        "Durasi",
        "Status"
      ]],
      body: filteredRows.map((r, i) => [
        i + 1,
        r.tanggal,
        r.nama_kegiatan,
        r.kategori,
        r.lokasi,
        `${r.durasi} Jam`,
        r.status
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41,128,185] }
    });

    doc.save("laporan_aktivitas.pdf");

  };

  /* ================= EXPORT EXCEL ================= */

  const exportExcel = () => {

    const data = filteredRows.map((row, i) => ({
      No: i + 1,
      Tanggal: row.tanggal,
      Kegiatan: row.nama_kegiatan,
      Kategori: row.kategori,
      Lokasi: row.lokasi,
      Durasi: row.durasi,
      Status: row.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Aktivitas");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(new Blob([buffer]), "aktivitas.xlsx");

  };

  /* ================= TABLE ================= */

  const columns = getColumns(
    handleDetail,
    handleEdit,
    handleDelete,
    handleKirim
  );

  /* ================= RENDER ================= */

  return (

    <MainCard
      title="Daftar Aktivitas"
      secondary={

        <Stack
          direction="row"
          spacing={1}
        >
          <TextField
            size="small"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">Semua</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="final">Final</MenuItem>
              <MenuItem value="dikirim">Dikirim</MenuItem>
              <MenuItem value="disetujui">Disetujui</MenuItem>
              <MenuItem value="ditolak">Ditolak</MenuItem>
              <MenuItem value="direvisi">Revisi</MenuItem>
            </Select>
          </FormControl>



          <Button
            variant="contained"
            startIcon={<PlusOutlined />}
            onClick={() => setOpenTambah(true)}
          >
            Tambah
          </Button>

          <Button onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </Button>
          
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >

            <MenuItem
              onClick={() => {
                exportPDF();
                setMenuAnchor(null);
              }}
            >
              Export PDF
            </MenuItem>

            <MenuItem
              onClick={() => {
                exportExcel();
                setMenuAnchor(null);
              }}
            >
              Export Excel
            </MenuItem>

          </Menu>



        </Stack>

      }
    >

      <AktivitasTable
        rows={filteredRows}
        columns={columns}
      />

      <TambahAktivitasModal
        open={openTambah}
        onClose={() => setOpenTambah(false)}
        onSubmit={handleTambah}
      />

      <EditAktivitasModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selectedData}
        onSubmit={handleUpdate}
      />

      <DetailAktivitasModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        data={selectedData}
      />

    </MainCard>

  );

}