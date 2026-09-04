import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { GetTableById } from "../services/table_service";
import { LoadCategories, GetAllFood } from "../services/customer_service";

import { CreateOrder } from "../services/food_order_service";
import FoodCategoryCard from "../components/food_category_card";
import { FoodCard } from "../components/food_card";

import { Plus, Minus, ShoppingBasket } from "lucide-react";
function Header({ table, setIsCartOpen, totalItems }) {
  return (
    <div className="bg-[#4B2E2B] text-white px-5 pt-6 pb-8 rounded-b-3xl relative overflow-hidden">
      {/* decorative accent blob */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#C08552]/20 blur-2xl" />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#FFF8F0]/70 font-semibold mb-1">
            Welcome to
          </p>
          <h1 className="text-xl sm:text-2xl font-bold">Eat N Dash</h1>
        </div>

        <button
          className="relative w-11 h-11 shrink-0 rounded-full bg-[#FFF8F0]/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
          onClick={() => setIsCartOpen(true)}>
          <span className="text-lg">
            {" "}
            <ShoppingBasket />
          </span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#C08552] text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {table && (
        <div className="mt-5 inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full pl-3 pr-4 py-1.5">
          <span className="w-6 h-6 shrink-0 rounded-full bg-[#C08552] flex items-center justify-center text-xs">
            🍽️
          </span>
          <span className="text-sm font-medium whitespace-nowrap">
            Table {table.table_number}
          </span>
          {table.status && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
              <span className="text-sm text-[#FFF8F0]/70 truncate">
                {table.status}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryTabs({ setActiveCategory, activeCategory, categories }) {
  return (
    <div className="sticky top-0 z-20 bg-[#FFF8F0]/95 backdrop-blur px-5 py-4 -mt-4">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setActiveCategory("All")}
          className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2.5 transition-all border ${
            activeCategory === "All"
              ? "bg-[#4B2E2B] border-[#4B2E2B] text-white shadow-md"
              : "bg-white border-[#C08552]/30 text-[#8C5A3C] hover:border-[#C08552]/60 cursor-pointer"
          }`}>
          <span className="text-sm font-medium whitespace-nowrap">All</span>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`shrink-0 flex items-center gap-2.5 rounded-full pl-1.5 pr-4 py-1.5 transition-all border ${
                isActive
                  ? "bg-[#4B2E2B] border-[#4B2E2B] text-white shadow-md"
                  : "bg-white border-[#C08552]/30 text-[#8C5A3C] hover:border-[#C08552]/60 cursor-pointer"
              }`}>
              <img
                src={cat.photo}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <span className="text-sm font-medium whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MainContent({ foods, activeCategory, cart, updateQuantity }) {
  const items =
    activeCategory === "All"
      ? foods
      : foods.filter((m) => m.category === activeCategory);

  return (
    <div className="px-4 sm:px-5 pb-32">
      <h2 className="text-lg font-bold text-[#4B2E2B] mb-4">
        {activeCategory}
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-16 text-[#C08552]/70 text-sm">
          Nothing in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#C08552]/30 overflow-hidden flex flex-col">
                <img
                  src={item.food_img}
                  alt={item.name}
                  className="h-28 sm:h-36 md:h-40 w-full object-cover"
                />
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <h3 className="font-semibold text-[#4B2E2B] text-sm truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-[#C08552]">
                    ₱{Number(item.price).toFixed(2)}
                  </p>

                  {qty === 0 ? (
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="mt-auto w-full h-8 rounded-full bg-[#C08552] hover:bg-[#8C5A3C] text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer">
                      Add
                    </button>
                  ) : (
                    <div className="mt-auto flex items-center justify-between bg-[#C08552]/10 rounded-full px-1 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-white text-[#4B2E2B] flex items-center justify-center font-bold shadow-sm cursor-pointer">
                        <Minus size="18" />
                      </button>
                      <span className="text-sm font-semibold text-[#4B2E2B] tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-[#C08552] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer">
                        <Plus size="18" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CartSidebar({
  table,
  isCartOpen,
  setIsCartOpen,
  cartItems,
  totalPrice,
  placingOrder,
  orderError,
  handlePlaceOrder,
  updateQuantity,
}) {
  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 sm:right-0 sm:left-auto sm:top-0 sm:h-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col rounded-t-3xl sm:rounded-none transition-transform duration-300 ${
          isCartOpen
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-x-full"
        } max-h-[85vh] sm:max-h-none`}>
        {/* Drag handle for mobile */}
        <div className="sm:hidden flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full bg-[#C08552]/30" />
        </div>

        <div className="p-5 flex items-center justify-between border-b border-[#C08552]/30">
          <div>
            <h2 className="text-lg font-bold text-[#4B2E2B]">Your Order</h2>
            <p className="text-sm text-[#8C5A3C]">
              Table {table?.table_number}
            </p>
          </div>
          <button
            className="w-9 h-9 shrink-0 rounded-full bg-[#C08552]/10 hover:bg-[#C08552]/20 flex items-center justify-center text-[#8C5A3C] transition-colors"
            onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-12">
              <ShoppingBasket size="45" />
              <p className="text-[#C08552]/70 text-sm">Your cart is empty.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.food_img}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#4B2E2B] truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#8C5A3C]">
                      ₱{item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#C08552]/10 rounded-full px-1 py-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-white text-[#4B2E2B] flex items-center justify-center text-sm font-bold shadow-sm">
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-semibold text-[#4B2E2B] tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-[#C08552] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] border-t border-[#C08552]/30 bg-[#FFF8F0] rounded-t-2xl sm:rounded-none">
            {orderError && (
              <p className="text-[#B4432F] text-sm mb-3">{orderError}</p>
            )}
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-[#8C5A3C] font-medium">Total</span>
              <span className="text-xl font-bold text-[#4B2E2B] tabular-nums">
                ₱{totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              className="btn w-full bg-[#C08552] hover:bg-[#8C5A3C] text-white border-none disabled:opacity-50 h-12"
              disabled={placingOrder}
              onClick={handlePlaceOrder}>
              {placingOrder ? "Placing order..." : "Place Order"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
function OrderMenuPage() {
  const { tableId } = useParams();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory("All");
    }
  }, [categories]);

  useEffect(() => {
    async function loadAllCategories() {
      setLoading(true);
      setError(null);
      try {
        const data = await LoadCategories();
        setCategories(data.results);
      } catch (err) {
        setError(err?.message || "Could not load categories.");
      } finally {
        setLoading(false);
      }
    }
    loadAllCategories();
  }, []);

  useEffect(() => {
    async function LoadFoods() {
      setLoading(true);
      setError(null);
      try {
        const data = await GetAllFood();
        setFoods(data.results);
      } catch (err) {
        setError(err?.message || "Could not load categories.");
      } finally {
        setLoading(false);
      }
    }
    LoadFoods();
  }, []);

  useEffect(() => {
    async function loadTable() {
      try {
        setLoading(true);
        setError(null);
        const data = await GetTableById(tableId);
        setTable(data);
      } catch (err) {
        setError(
          err?.message || "Could not load table. Please rescan the QR code.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadTable();
  }, [tableId]);

  const updateQuantity = (itemId, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[itemId] || 0) + delta;
      if (newQty <= 0) {
        delete next[itemId];
      } else {
        next[itemId] = newQty;
      }
      return next;
    });
  };

  const cartItems = useMemo(
    () =>
      Object.entries(cart).map(([id, qty]) => {
        const item = foods.find((m) => m.id === Number(id));
        return { ...item, price: Number(item?.price), qty };
      }),
    [cart, foods],
  );

  const totalItems = cartItems.reduce((n, i) => n + i.qty, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function handlePlaceOrder() {
    setPlacingOrder(true);
    setOrderError(null);
    try {
      const data = await GetTableById(tableId);
      const payload = {
        table: data.id,
        orders: cartItems.map((i) => ({ food: i.id, qty: i.qty })),
      };
      await CreateOrder(payload);
      setOrderPlaced(true);
      setCart({});
      setIsCartOpen(false);
    } catch (err) {
      setOrderError(err?.message || "Could not place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8F0]">
        <span className="loading loading-spinner loading-lg text-[#C08552]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center bg-[#FFF8F0]">
        <div className="w-16 h-16 rounded-full bg-[#F7E4E0] flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-[#8C3624] font-medium max-w-xs">{error}</p>
        <button
          className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-white border-none px-8"
          onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-6 text-center bg-[#FFF8F0]">
        <div className="w-20 h-20 rounded-full bg-[#E6EFE3] flex items-center justify-center mb-2">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-[#4B2E2B]">Order sent!</h1>
        <p className="text-[#8C5A3C] max-w-xs">
          Table {table?.table_number} — your order is on its way to the kitchen.
        </p>
        <button
          className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-white border-none mt-4 px-8"
          onClick={() => setOrderPlaced(false)}>
          Order More
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header
        table={table}
        setIsCartOpen={setIsCartOpen}
        totalItems={totalItems}
      />
      <CategoryTabs
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
        categories={categories}
      />
      <MainContent
        foods={foods}
        activeCategory={activeCategory}
        cart={cart}
        updateQuantity={updateQuantity}
      />

      {/* Floating cart bar — only shows once something's in the cart */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 left-4 right-4 z-30 bg-[#4B2E2B] text-white rounded-2xl shadow-xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between max-w-md mx-auto"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
          <span className="flex items-center gap-3">
            <span className="w-7 h-7 shrink-0 rounded-full bg-[#C08552] flex items-center justify-center text-sm font-bold">
              {totalItems}
            </span>
            <span className="font-medium">View cart</span>
          </span>
          <span className="font-semibold tabular-nums">
            ₱{totalPrice.toFixed(2)}
          </span>
        </button>
      )}

      <CartSidebar
        table={table}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        totalPrice={totalPrice}
        placingOrder={placingOrder}
        orderError={orderError}
        handlePlaceOrder={handlePlaceOrder}
        updateQuantity={updateQuantity}
      />
    </div>
  );
}
export default OrderMenuPage;
