const TABLE_STATUS_STYLE = {
  Available: "border-[#3D6640] bg-[#E6EFE3] text-[#3D6640]",
  Occupied: "border-[#E8E0D2] bg-[#F5EFE2] text-[#A8977E]",
};

function TableSelectModal({ tables, loading, onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="bg-white border border-[#E8E0D2] rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[#E8E0D2] sticky top-0 bg-white">
          <h2 className="font-semibold text-[#2B2018] text-sm">
            Select a table
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#8C7E68] hover:bg-[#F5EFE2] transition-colors text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center text-[#A8977E] text-sm py-10">
              Loading tables…
            </div>
          ) : tables.length === 0 ? (
            <div className="text-center text-[#A8977E] text-sm py-10">
              No tables found
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {tables.map((table) => {
                const available = table.status === "Available";
                return (
                  <button
                    key={table.id}
                    disabled={!available}
                    onClick={() => available && onSelect(table)}
                    className={`border-2 rounded-lg py-3 px-2 text-center transition-colors ${
                      TABLE_STATUS_STYLE[table.status] ||
                      "border-[#E8E0D2] bg-[#F5EFE2] text-[#A8977E]"
                    } ${
                      available
                        ? "hover:border-[#E0722C] hover:bg-[#FBF0E4] cursor-pointer"
                        : "cursor-not-allowed opacity-60"
                    }`}>
                    <div className="text-sm font-semibold">
                      {table.table_number}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide mt-1 font-medium">
                      {table.status}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dashed border-[#E8E0D2] text-[11px] text-[#8C7E68]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E6EFE3] border border-[#3D6640]" />
              Available
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F5EFE2] border border-[#E8E0D2]" />
              Occupied
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableSelectModal;
