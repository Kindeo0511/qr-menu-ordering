import { useEffect, useMemo, useState } from "react";
import { ShowAllOrder, UpdateStatus } from "../services/food_order_service";
import { GetAllFood } from "../services/food_service";
import { LoadCategories } from "../services/category_service";
import { SavePayment } from "../services/payment_service";
import { GetAllTable } from "../services/table_service";
import { CreateOrder } from "../services/food_order_service";
import TableSelectModal from "../components/table_select_modal";
import { useAuth } from "../auth/user_auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
const peso = (n) => `₱${n.toFixed(2)}`;

const STATUS_MAP = {
  Pending: "new",
  Preparing: "preparing",
  Ready: "ready",
  Served: "served",
};

// ── Orders tab ────────────────────────────────────────────────────────────

function OrdersTab({ priceLookup }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [cashInput, setCashInput] = useState("");
  const [receipt, setReceipt] = useState(null); // holds last completed order for the receipt modal

  const normalizeOrder = (raw) => {
    const items = (raw.orders || []).map((item) => ({
      id: item.id,
      qty: item.qty,
      name: item.food_name,
      price: priceLookup[item.food_name] ?? 0,
    }));
    const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);
    return {
      id: raw.id,
      table_number: raw.table,
      status: STATUS_MAP[raw.order_status] || "new",
      placed_at: new Date(raw.created_at).getTime(),
      items,
      total,
      paid: raw.payment_status === "Paid",
    };
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await ShowAllOrder();
        setOrders(data.map(normalizeOrder));
        setError(null);
      } catch (err) {
        setError("Couldn't load orders");
      } finally {
        setLoading(false);
      }
    }
    load();
    const poll = setInterval(load, 5000);
    return () => clearInterval(poll);
  }, [priceLookup]);

  const unpaid = orders.filter((o) => !o.paid);
  const active = unpaid.find((o) => o.id === activeId) || null;
  const cash = parseFloat(cashInput) || 0;
  const change = active ? cash - active.total : 0;

  const openOrder = (order) => {
    setActiveId((prev) => (prev === order.id ? null : order.id));
    setCashInput("");
  };

  const confirmPayment = async () => {
    if (!active || active.status !== "served" || cash < active.total) return;
    try {
      const payload = {
        table_order: active.id,
        total_amount: active.total,
        amount_received: cash,
      };
      await SavePayment(payload);
      setOrders((prev) =>
        prev.map((o) => (o.id === active.id ? { ...o, paid: true } : o)),
      );
      setReceipt({
        ...active,
        cash,
        change: cash - active.total,
        paidAt: new Date(),
      });
      setActiveId(null);
      setCashInput("");
    } catch (err) {
      console.log(err);
      setError("Payment couldn't be saved please try again");
    }
  };

  const printReceipt = () => {
    if (!receipt) return;

    const filename = `Receipt-Order-${receipt.id}`; // no spaces/special chars, safer for filenames

    const itemsHtml = receipt.items
      .map(
        (item) => `
      <div class="row">
        <span>${item.qty}x ${item.name}</span>
        <span>${peso(item.qty * item.price)}</span>
      </div>`,
      )
      .join("");

    const html = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 20px; color: #2B2018; width: 280px; margin: 0 auto; }
          h2 { text-align: center; margin-bottom: 4px; }
          .sub { text-align: center; font-size: 12px; color: #8C7E68; margin-bottom: 16px; }
          .row { display: flex; justify-content: space-between; font-size: 13px; margin: 4px 0; }
          .divider { border-top: 1px dashed #C9BEA8; margin: 10px 0; }
          .total { font-weight: bold; font-size: 15px; }
        </style>
      </head>
      <body>
        <h2>${receipt.table_number}</h2>
        <div class="sub">Order #${receipt.id} &middot; ${receipt.paidAt.toLocaleString()}</div>
        <div class="divider"></div>
        ${itemsHtml}
        <div class="divider"></div>
        <div class="row total"><span>Total</span><span>${peso(receipt.total)}</span></div>
        <div class="row"><span>Cash</span><span>${peso(receipt.cash)}</span></div>
        <div class="row"><span>Change</span><span>${peso(receipt.change)}</span></div>
        <div class="divider"></div>
        <div class="sub">Thank you!</div>
      </body>
    </html>`;

    const printWindow = window.open("", "_blank", "width=320,height=600");
    if (!printWindow) {
      alert("Please allow popups to print the receipt.");
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.document.title = filename; // reinforce it directly, don't just rely on <title>

    // Give the browser a moment to register the title before opening the print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 bg-[#FFF8F0] p-6 rounded-2xl">
      {/* Orders grid */}
      <div>
        {error && (
          <div className="text-sm text-[#B4432F] bg-[#C08552] border border-[#C08552] rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}
        {loading && orders.length === 0 ? (
          <div className="text-center text-[#8C5A3C] text-sm py-16">
            Loading orders…
          </div>
        ) : unpaid.length === 0 ? (
          <div className="border border-dashed border-[#8C5A3C]/30 rounded-xl py-16 text-center text-sm text-[#8C5A3C] bg-[#FFF8F0]">
            No unpaid orders right now
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unpaid.map((order) => (
              <button
                key={order.id}
                onClick={() => openOrder(order)}
                className={`cursor-pointer text-left bg-[#FFF8F0] border-2 rounded-xl p-4 transition-colors ${
                  activeId === order.id
                    ? "border-[#C08552]"
                    : "border-[#8C5A3C] hover:border-[#C08552]/40"
                }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-[#4B2E2B]">
                      {order.table_number}
                    </div>
                    <div className="font-mono text-xs text-[#8C5A3C] mt-0.5">
                      ORDER #{order.id}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide bg-[#C08552]/20 text-[#8C5A3C] px-2 py-1 rounded-full font-semibold">
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-[#8C5A3C] mt-3">
                  {order.items.length} item(s)
                </div>
                <div className="font-mono text-lg font-semibold text-[#4B2E2B] mt-1">
                  {peso(order.total)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Payment panel */}
      <div className="bg-[#FFF8F0] border border-[#8C5A3C] rounded-xl p-5 h-fit sticky top-6 shadow-sm">
        {!active ? (
          <div className="text-sm text-[#8C5A3C] text-center py-10">
            Select an order to process payment
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="font-semibold text-[#4B2E2B]">
                {active.table_number}
              </div>
              <div className="font-mono text-xs text-[#8C5A3C]">
                ORDER #{active.id}
              </div>
            </div>

            <div className="space-y-1.5 border-t border-b border-dashed border-[#8C5A3C]/30 py-3 mb-3">
              {active.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-[#4B2E2B]">
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-mono text-[#8C5A3C]">
                    {peso(item.qty * item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold text-[#4B2E2B] text-lg mb-4">
              <span>Total</span>
              <span className="font-mono">{peso(active.total)}</span>
            </div>

            {/* warning when the order isn't served yet */}
            {active.status !== "served" && (
              <div className="text-xs text-[#C08552] bg-[#C08552]/20 border border-[#C08552] rounded-lg px-3 py-2 mb-3 font-medium">
                This order hasn't been served yet — payment can't be processed
                until it's marked served.
              </div>
            )}

            <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
              Cash received
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={cashInput}
              onChange={(e) => setCashInput(e.target.value)}
              placeholder="0.00"
              disabled={active.status !== "served"}
              className="w-full bg-[#FFF8F0] border border-[#8C5A3C]/30 rounded-lg px-3 py-2.5 text-[#4B2E2B] font-mono mb-3 focus:outline-none focus:border-[#C08552] focus:ring-2 focus:ring-[#C08552]/20
            disabled:bg-[#C08552]/10 disabled:text-[#8C5A3C]
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <div className="flex justify-between text-sm mb-4 bg-[#C08552]/10 rounded-lg px-3 py-2.5">
              <span className="text-[#8C5A3C] font-medium">Change</span>
              <span
                className={`font-mono font-semibold ${
                  change < 0 ? "text-[#C08552]" : "text-[#4B2E2B]"
                }`}>
                {peso(Math.max(0, change))}
              </span>
            </div>

            <button
              onClick={confirmPayment}
              disabled={active.status !== "served" || cash < active.total}
              className="w-full bg-[#C08552] hover:bg-[#8C5A3C] disabled:bg-[#8C5A3C]/20 disabled:text-[#8C5A3C] text-[#FFF8F0] font-semibold rounded-lg py-3 transition-colors">
              Confirm Payment
            </button>
          </>
        )}
      </div>

      {/* Receipt modal — shown after a successful payment */}
      {receipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#FFF8F0] rounded-xl p-6 w-full max-w-sm shadow-lg">
            <div className="text-center mb-4">
              <div className="font-semibold text-[#4B2E2B] text-lg">
                Payment Successful
              </div>
              <div className="text-sm text-[#8C5A3C]">
                {receipt.table_number} · Order #{receipt.id}
              </div>
            </div>

            <div className="space-y-1.5 border-t border-b border-dashed border-[#8C5A3C]/30 py-3 mb-3">
              {receipt.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-[#4B2E2B]">
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-mono text-[#8C5A3C]">
                    {peso(item.qty * item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm text-[#8C5A3C] mb-1">
              <span>Cash</span>
              <span className="font-mono">{peso(receipt.cash)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#8C5A3C] mb-3">
              <span>Change</span>
              <span className="font-mono">{peso(receipt.change)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#4B2E2B] text-lg mb-5">
              <span>Total</span>
              <span className="font-mono">{peso(receipt.total)}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setReceipt(null)}
                className="flex-1 border border-[#8C5A3C]/30 text-[#4B2E2B] rounded-lg py-2.5 font-medium hover:bg-[#C08552]/20">
                Close
              </button>
              <button
                onClick={printReceipt}
                className="flex-1 bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] rounded-lg py-2.5 font-semibold">
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ── Table select modal ────────────────────────────────────────────────────

// ── New Order tab (walk-ins without a QR code) ───────────────────────────

function NewOrderTab({ foods, categories }) {
  const [cart, setCart] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const openTableModal = async () => {
    setTableModalOpen(true);
    setLoadingTables(true);
    try {
      const data = await GetAllTable();
      setTables(data.results);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingTables(false);
    }
  };

  const foodById = useMemo(
    () => Object.fromEntries(foods.map((f) => [f.id, f])),
    [foods],
  );

  const visibleFoods = useMemo(() => {
    if (activeCategory === "all") return foods;
    return foods.filter(
      (f) => String(f.category_id) === String(activeCategory),
    );
  }, [foods, activeCategory]);

  const addItem = (foodId) => {
    setCart((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
  };
  const removeItem = (foodId) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[foodId] <= 1) delete next[foodId];
      else next[foodId] -= 1;
      return next;
    });
  };

  const cartItems = Object.entries(cart).map(([foodId, qty]) => {
    const food = foodById[foodId];
    return {
      id: foodId,
      name: food?.name ?? "Item",
      price: food?.price ?? 0,
      qty,
    };
  });
  const total = cartItems.reduce((sum, it) => sum + it.qty * it.price, 0);

  const submitOrder = async () => {
    if (!selectedTable || cartItems.length === 0) return;
    setSubmitting(true);
    setMessage(null);
    try {
      await CreateOrder({
        table: selectedTable.id,
        orders: cartItems.map((it) => ({ food: it.id, qty: it.qty })),
      });
      await new Promise((res) => setTimeout(res, 600));
      setMessage({
        type: "success",
        text: `Order sent for ${selectedTable.table_number}`,
      });
      setCart({});
      setSelectedTable(null);
    } catch (err) {
      console.log(err);
      setMessage({ type: "error", text: "Couldn't submit the order" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 bg-[#FFF8F0] p-6 rounded-2xl">
      <div>
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === "all"
                ? "bg-[#C08552] border-[#C08552] text-[#FFF8F0]"
                : "bg-[#FFF8F0] border-[#8C5A3C]/30 text-[#4B2E2B] hover:border-[#C08552]/40"
            }`}>
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                String(activeCategory) === String(cat.id)
                  ? "bg-[#C08552] border-[#C08552] text-[#FFF8F0]"
                  : "bg-[#FFF8F0] border-[#8C5A3C]/30 text-[#4B2E2B] hover:border-[#C08552]/40"
              }`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        {visibleFoods.length === 0 ? (
          <div className="border border-dashed border-[#8C5A3C]/30 rounded-xl py-16 text-center text-sm text-[#8C5A3C] bg-[#FFF8F0]">
            No items in this category
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {visibleFoods.map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item.id)}
                className="cursor-pointer text-left bg-[#FFF8F0] border border-[#8C5A3C]/30 hover:border-[#C08552] rounded-xl p-3 transition-colors">
                <div className="text-sm font-medium text-[#4B2E2B]">
                  {item.name}
                </div>
                <div className="font-mono text-xs text-[#C08552] font-semibold mt-1">
                  {peso(Number(item.price))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="bg-[#FFF8F0] border border-[#8C5A3C]/30 rounded-xl p-5 h-fit sticky top-6 shadow-sm">
        <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
          Table
        </label>
        <button
          onClick={openTableModal}
          className={`w-full border rounded-lg px-3 py-2.5 mb-4 transition-colors font-medium ${
            selectedTable
              ? "border-[#C08552] bg-[#C08552]/20 text-[#4B2E2B]"
              : "bg-[#C08552] hover:bg-[#8C5A3C] border-[#C08552] text-[#FFF8F0]"
          }`}>
          {selectedTable ? selectedTable.table_number : "Tap to select a table"}
        </button>

        {tableModalOpen && (
          <TableSelectModal
            tables={tables}
            loading={loadingTables}
            onClose={() => setTableModalOpen(false)}
            onSelect={(table) => {
              setSelectedTable(table);
              setTableModalOpen(false);
            }}
          />
        )}

        {cartItems.length === 0 ? (
          <div className="text-sm text-[#8C5A3C] text-center py-10">
            Tap menu items to add them
          </div>
        ) : (
          <div className="space-y-2 border-t border-b border-dashed border-[#8C5A3C]/30 py-3 mb-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm">
                <span className="text-[#4B2E2B]">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#C08552]/10 text-[#8C5A3C] hover:bg-[#8C5A3C]/20 transition-colors">
                    −
                  </button>
                  <span className="font-mono w-4 text-center text-[#4B2E2B]">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#C08552] text-[#FFF8F0] hover:bg-[#8C5A3C] transition-colors">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between font-semibold text-[#4B2E2B] text-lg mb-4">
          <span>Total</span>
          <span className="font-mono">{peso(total)}</span>
        </div>

        {message && (
          <div
            className={`text-xs rounded-lg px-3 py-2.5 mb-3 font-medium ${
              message.type === "success"
                ? "bg-[#C08552]/20 text-[#4B2E2B]"
                : "bg-[#C08552]/20 text-[#C08552]"
            }`}>
            {message.text}
          </div>
        )}

        <button
          onClick={submitOrder}
          disabled={!selectedTable || cartItems.length === 0 || submitting}
          className="w-full bg-[#C08552] hover:bg-[#8C5A3C] disabled:bg-[#8C5A3C]/20 disabled:text-[#8C5A3C] text-[#FFF8F0] font-semibold rounded-lg py-3 transition-colors">
          {submitting ? "Sending…" : "Send to Kitchen"}
        </button>
      </div>
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────
export default function CashierPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    async function loadMenuData() {
      try {
        setLoadingMenu(true);
        const [foodData, categoryData] = await Promise.all([
          GetAllFood(),
          LoadCategories(),
        ]);
        setFoods(foodData.results);
        setCategories(categoryData.results);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingMenu(false);
      }
    }
    loadMenuData();
  }, [loading]);

  const priceLookup = useMemo(
    () => Object.fromEntries(foods.map((f) => [f.name, Number(f.price)])),
    [foods],
  );
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading || !user) return null;
  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6">
      <div className="grid grid-cols-3 items-center mb-6">
        {/* Left: user info */}
        <div className="flex items-center gap-3">
          <div className="px-2 uppercase h-9 rounded-lg bg-[#C08552] text-[#FFF8F0] font-bold flex items-center justify-center">
            {user.role_display}
          </div>
          <h1 className="font-semibold text-2xl text-[#4B2E2B]">
            {user.first_name}
          </h1>
        </div>

        {/* Center: tabs */}
        <div className="flex justify-center">
          <div className="flex bg-[#FFF8F0] border border-[#8C5A3C]/30 rounded-lg p-1">
            <button
              onClick={() => setTab("orders")}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
                tab === "orders"
                  ? "bg-[#C08552] text-[#FFF8F0]"
                  : "text-[#8C5A3C] hover:bg-[#C08552]/20"
              }`}>
              Process Orders
            </button>
            <button
              onClick={() => setTab("new")}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
                tab === "new"
                  ? "bg-[#C08552] text-[#FFF8F0]"
                  : "text-[#8C5A3C] hover:bg-[#C08552]/20"
              }`}>
              New Order (Walk-in)
            </button>
          </div>
        </div>

        {/* Right: logout */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#8C5A3C]/30 bg-[#FFF8F0] text-[#4B2E2B] hover:bg-[#C08552]/20 transition-colors text-sm font-medium cursor-pointer">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {loadingMenu ? (
        <div className="text-center text-[#8C5A3C] text-sm py-16">
          Loading menu…
        </div>
      ) : tab === "orders" ? (
        <OrdersTab priceLookup={priceLookup} />
      ) : (
        <NewOrderTab foods={foods} categories={categories} />
      )}
    </div>
  );
}
