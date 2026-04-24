import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function AktivitasTable({ rows = [], columns = [] }) {

  const [tableRows, setTableRows] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0
  });

  /* ================= NORMALIZE ROW ================= */

  useEffect(() => {

    const normalized = rows.map((row, index) => ({
      ...row,
      id: Number(row.id ?? index + 1) // pastikan id number & unik
    }));

    setTableRows(normalized);

  }, [rows]);

  /* ================= RENDER ================= */

  return (

    <div style={{ height: 520, width: "100%" }}>

      <DataGrid
        rows={tableRows}
        columns={columns}

        getRowId={(row) => row.id}

        disableRowSelectionOnClick

        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}

        pageSizeOptions={[5, 10, 20]}

        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold"
          },

          "& .MuiDataGrid-cell": {
            alignItems: "center"
          }

        }}

      />

    </div>

  );

}