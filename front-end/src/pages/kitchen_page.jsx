import { useEffect, useState } from "react";
import { ShowAllOrder, UpdateStatus } from "../services/food_order_service";

const NEXT_STATUS = { new: "preparing", preparing: "ready", ready: "served" };
const ACTION_LABEL = {
  new: "Start cooking",
  preparing: "Mark ready",
  ready: "Mark served",
};
const ACTION_CLASS = {
  new: "bg-[#C08552] hover:bg-[#8C5A3C]",
  preparing: "bg-[#8C5A3C] hover:bg-[#4B2E2B]",
  ready: "bg-[#4B2E2B] hover:bg-[#3D2E20]",
};
const COLUMN_META = [
  { key: "new", label: "New", dot: "bg-[#C08552]" },
  { key: "preparing", label: "Preparing", dot: "bg-[#8C5A3C]" },
  { key: "ready", label: "Ready to Serve", dot: "bg-[#4B2E2B]" },
];
const EMPTY_COPY = {
  new: "No new orders — kitchen's clear",
  preparing: "Nothing on the line right now",
  ready: "Nothing waiting to be served",
};

const STATUS_MAP = {
  Pending: "new",
  Preparing: "preparing",
  Ready: "ready",
  Served: "served",
};

const STATUS_MAP_REVERSE = {
  new: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

function normalizeOrder(raw) {
  return {
    id: raw.id,
    table_number: raw.table,
    status: STATUS_MAP[raw.order_status] || "new",
    placed_at: new Date(raw.created_at).getTime(),
    items: (raw.orders || []).map((item) => ({
      qty: item.qty,
      name: item.food_name,
      note: item.note ?? "",
    })),
    note: raw.note ?? "",
  };
}

function ageBucket(minutes) {
  if (minutes < 6)
    return {
      border: "border-l-[#8C5A3C]",
      chip: "bg-[#C08552]/20 text-[#4B2E2B]",
    };
  if (minutes < 12)
    return {
      border: "border-l-[#C08552]",
      chip: "bg-[#C08552]/10 text-[#8C5A3C]",
    };
  return {
    border: "border-l-[#4B2E2B]",
    chip: "bg-[#C08552]/20 text-[#C08552]",
  };
}

function formatElapsed(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

function OrderTicket({ order, now, onAdvance }) {
  const elapsedMs = now - order.placed_at;
  const bucket = ageBucket(elapsedMs / 60000);

  return (
    <div
      className={`bg-[#FFF8F0] border border-[#8C5A3C]/30 border-l-4 ${bucket.border} rounded-xl shadow-sm`}>
      <div className="p-4">
        <div className="flex items-start justify-between border-b border-dashed border-[#8C5A3C]/30 pb-2 mb-2">
          <div>
            <div className="font-semibold text-lg leading-none text-[#4B2E2B]">
              {order.table_number}
            </div>
            <div className="font-mono text-xs text-[#8C5A3C] mt-1">
              ORDER #{order.id}
            </div>
          </div>
          <div
            className={`font-mono text-xs px-2 py-1 rounded-md font-semibold ${bucket.chip}`}>
            {formatElapsed(elapsedMs)}
          </div>
        </div>

        {order.items.length === 0 ? (
          <div className="text-xs text-[#8C5A3C] italic">No items listed</div>
        ) : (
          <ul className="text-sm space-y-1 text-[#4B2E2B]">
            {order.items.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-mono text-xs text-[#8C5A3C] min-w-5">
                  {item.qty}x
                </span>
                <span>
                  {item.name}
                  {item.note && (
                    <span className="block text-xs italic text-[#8C5A3C]">
                      {item.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        {order.note && (
          <div className="mt-2 text-xs bg-[#C08552]/20 text-[#4B2E2B] rounded-md px-3 py-2 font-medium">
            ⚠ {order.note}
          </div>
        )}

        <button
          className={`w-full mt-3 text-sm font-semibold text-[#FFF8F0] rounded-lg py-2.5 transition-colors ${ACTION_CLASS[order.status]}`}
          onClick={() => onAdvance(order)}>
          {ACTION_LABEL[order.status]}
        </button>
      </div>
    </div>
  );
}

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await ShowAllOrder();
        setOrders(
          data.map(normalizeOrder).filter((o) => o.status !== "served"),
        );
        setError(null);
      } catch (err) {
        console.log(err);
        setError("Couldn't load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();

    const poll = setInterval(loadOrders, 5000);
    return () => clearInterval(poll);
  }, []);

  const handleAdvance = (order) => {
    const next = NEXT_STATUS[order.status];
    const payload = { order_status: STATUS_MAP_REVERSE[next] };
    ChangeStatus(payload, order);
    setOrders((prev) =>
      next === "served"
        ? prev.filter((o) => o.id !== order.id)
        : prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)),
    );
  };

  async function ChangeStatus(payload, order) {
    try {
      await UpdateStatus(payload, order.id);
    } catch (err) {
      console.log(err);
      setError("Couldn't update that order — please try again");
      setOrders((prev) => {
        const stillHasIt = prev.some((o) => o.id === order.id);
        if (stillHasIt) {
          return prev.map((o) =>
            o.id === order.id ? { ...o, status: order.status } : o,
          );
        }
        return [...prev, order].sort((a, b) => a.placed_at - b.placed_at);
      });
    }
  }

  const grouped = COLUMN_META.reduce((acc, col) => {
    acc[col.key] = orders
      .filter((o) => o.status === col.key)
      .sort((a, b) => a.placed_at - b.placed_at);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-full h-9 rounded-lg bg-[#C08552] text-[#FFF8F0] font-bold flex items-center justify-center">
            KITCHEN
          </div>
          <div>
            <p className="font-mono text-xs text-[#8C5A3C]">
              {new Date(now).toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs text-[#C08552] font-medium">{error}</span>
          )}
          <div className="flex items-center gap-2 border border-[#8C5A3C]/30 bg-[#FFF8F0] rounded-full px-3 py-1.5 font-mono text-xs text-[#8C5A3C]">
            <span className="w-2 h-2 rounded-full bg-[#4B2E2B] animate-pulse" />
            {orders.length} active
          </div>
          <div className="font-mono text-sm text-[#8C5A3C]">
            {new Date(now).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="text-center text-[#8C5A3C] text-sm py-20">
          Loading orders…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMN_META.map((col) => (
            <div key={col.key}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4B2E2B]">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  {col.label}
                </div>
                <div className="text-xs font-mono text-[#8C5A3C] border border-[#8C5A3C]/30 bg-[#FFF8F0] rounded-full px-2 py-0.5">
                  {grouped[col.key].length}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {grouped[col.key].length === 0 ? (
                  <div className="border border-dashed border-[#8C5A3C]/30 rounded-xl py-8 px-4 text-center text-xs text-[#8C5A3C] bg-[#FFF8F0]">
                    {EMPTY_COPY[col.key]}
                  </div>
                ) : (
                  grouped[col.key].map((order) => (
                    <OrderTicket
                      key={order.id}
                      order={order}
                      now={now}
                      onAdvance={handleAdvance}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
