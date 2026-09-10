import { useState, useEffect } from "react";
import {
  AddTable,
  UpdateTable,
  GetTableById,
  GenerateQRCode,
} from "../services/table_service";
import Alert from "./Alert";
import { extractErrorMessage } from "../utils/util";
function CreateTableModal({ modal_id, setTables, onSuccess }) {
  const [tableCount, setTableCount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  async function HandleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const parsedCount = parseInt(tableCount, 10);
      if (!Number.isInteger(parsedCount) || parsedCount <= 0) {
        setError("Please enter a valid number of tables.");
        setLoading(false);
        return;
      }
      const data = await AddTable({ table_count: parsedCount });
      const newTables = Array.isArray(data) ? data : [data];
      setTables((prev) => [...prev, ...newTables]);
      setTableCount("");
      onSuccess("Table added successfully.");
      ClearFields();
      document.getElementById(modal_id).close();
    } catch (err) {
      setErrorMsg(err?.detail || err?.message || "Failed to add table.");
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  function ClearFields() {
    setError(null);
    setErrorMsg(null);
  }

  return (
    <dialog id={modal_id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-md bg-[#FFF8F0]">
        <h3 className="text-lg font-semibold text-[#4B2E2B] mb-4">Set Table</h3>
        {errorMsg && <Alert type="error" message={errorMsg} />}
        <form onSubmit={HandleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col w-full gap-1.5">
            <label
              className="text-sm font-medium text-[#4B2E2B]"
              htmlFor="tableCount">
              Number of Tables
            </label>
            <input
              id="tableCount"
              type="number"
              className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter how many tables"
              value={tableCount}
              onChange={(e) => setTableCount(e.target.value)}
            />

            {error && <p className="text-[#C08552] text-xs mt-0.5">{error}</p>}
          </div>

          <div className="modal-action flex justify-end gap-2 mt-1">
            <button
              type="button"
              className="btn bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] hover:bg-[#C08552] hover:text-[#FFF8F0]"
              onClick={() => document.getElementById(modal_id).close()}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none disabled:opacity-50"
              disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function ViewTableModal({ modal_id, tableId }) {
  const [table, setTable] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tableId) return;
    async function GetTable() {
      try {
        setLoading(true);
        const data = await GetTableById(tableId);
        setTable(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    GetTable();
  }, [tableId]);

  async function PrintQrCode(id) {
    setLoading(true);
    try {
      const data = await GenerateQRCode(id); // axios call, responseType: 'blob'
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open in a new tab and trigger print once loaded
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        // Popup blocked — fall back to download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "qr_table.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Revoke later so the new tab has time to load it
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog id={modal_id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-2xl bg-[#FFF8F0]">
        <h3 className="text-lg font-semibold text-[#4B2E2B] mb-4">
          Table Details
        </h3>

        {loading ? (
          <p className="text-[#8C5A3C] text-sm">Loading...</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col w-full gap-1">
                <span className="text-xs font-semibold uppercase text-[#8C5A3C]">
                  Table Number
                </span>
                <p className="text-base text-[#4B2E2B] font-medium">
                  {table.table_number}
                </p>
              </div>
              <div className="flex flex-col w-full gap-1">
                <span className="text-xs font-semibold uppercase text-[#8C5A3C]">
                  Status
                </span>
                <p className="text-base text-[#4B2E2B]">{table.status}</p>
              </div>
              <div className="flex flex-col w-full gap-1">
                <span className="text-xs font-semibold uppercase text-[#8C5A3C]">
                  QR Link
                </span>
                <p className="text-sm text-[#4B2E2B] break-all">
                  {table.qr_data}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start gap-2 md:w-48">
              <span className="text-xs font-semibold uppercase text-[#8C5A3C]">
                QR Code
              </span>
              {table.qr_image_url ? (
                <img
                  src={table.qr_image_url}
                  alt={`QR code for table ${table.table_number}`}
                  className="w-40 h-40 object-contain border border-[#8C5A3C] rounded-box bg-[#FFF8F0] p-2"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-sm text-[#C08552] border border-dashed border-[#8C5A3C] rounded-box">
                  No QR code
                </div>
              )}
            </div>
          </div>
        )}

        <div className="modal-action flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none"
            onClick={() => PrintQrCode(table.table_number)}>
            Print QR Code
          </button>
          <button
            type="button"
            className="btn bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] hover:bg-[#C08552] hover:text-[#FFF8F0]"
            onClick={() => document.getElementById(modal_id).close()}>
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function UpdateTableModal({ modal_id, tableId, setTables, onSuccess }) {
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  async function HandleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const parsedCount = parseInt(tableNumber, 10);
      if (!Number.isInteger(parsedCount) || parsedCount <= 0) {
        setError("Please enter a valid table number.");
        setLoading(false);
        return;
      }
      const data = await UpdateTable({ table_number: parsedCount }, tableId);
      setTables((prev) =>
        prev.map((table) => (table.id === data.id ? data : table)),
      );
      ClearFields();
      setTableNumber("");
      onSuccess("Table added successfully.");
      document.getElementById(modal_id).close();
    } catch (err) {
      const message = extractErrorMessage(err);
      // setErrorMsg(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function ClearFields() {
    setError(null);
    setErrorMsg(null);
    setTableNumber("");
  }

  return (
    <dialog id={modal_id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-md bg-[#FFF8F0]">
        <h3 className="text-lg font-semibold text-[#4B2E2B] mb-4">
          Update Table
        </h3>
        {errorMsg && <Alert type="error" message={errorMsg} />}
        <form onSubmit={HandleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col w-full gap-1.5">
            <label
              className="text-sm font-medium text-[#4B2E2B]"
              htmlFor="tableNumber">
              Table Number
            </label>
            <input
              id="tableNumber"
              type="number"
              className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter table number"
              max="100"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />

            {error && <p className="text-[#C08552] text-xs mt-0.5">{error}</p>}
          </div>

          <div className="modal-action flex justify-end gap-2 mt-1">
            <button
              type="button"
              className="btn bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] hover:bg-[#C08552] hover:text-[#FFF8F0]"
              onClick={() => document.getElementById(modal_id).close()}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none disabled:opacity-50"
              disabled={loading}>
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export { CreateTableModal, UpdateTableModal, ViewTableModal };
