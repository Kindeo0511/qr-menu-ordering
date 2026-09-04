import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserFormModal from "../components/user_form_modal";
import CategoryFormModal from "../components/category_form_modal";
import FoodFormModal from "../components/food_form_modal";
import PaymentFormModal from "../components/payment_form_modal";
import { useAuth } from "../auth/user_auth";
import { GetCurrentUser } from "../services/user_service";
import {
  CreateTableModal,
  UpdateTableModal,
  ViewTableModal,
} from "../components/table_form_modal";

import { ShowDashBoardStats } from "../services/dashboard_service";
import { GetAllUser, DeleteUser } from "../services/user_service";
import { GetAllFood, DeleteFood, ChangeStatus } from "../services/food_service";
import { GetAllTable, DeleteTable } from "../services/table_service";
import { ShowAllPaymentRecords } from "../services/payment_service";
import { formatDateTime, formatPrice } from "../utils/util";
import { ShowAllOrder } from "../services/food_order_service";
import DashBoardStatsCard from "../components/dashboard_stat";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  DeleteCategory,
  GetCategory,
  LoadCategories,
} from "../services/category_service";

import {
  Tags,
  Plus,
  Armchair,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  UtensilsCrossed,
  Eye,
  Table,
  CreditCard,
  UserPlus,
  SquarePen,
  Trash2,
  LayoutGrid,
  BarChart3,
  Users,
  Package,
  MessageSquare,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  CircleHelp,
  LogOut,
  Menu,
  X,
  ToggleLeft,
  ToggleRight,
  CircleCheck,
  CircleX,
  Receipt,
  Search,
} from "lucide-react";

const nav = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", icon: LayoutGrid }],
  },
  {
    section: "Manage",
    items: [
      { label: "Users", icon: Users },
      { label: "Tables", icon: Armchair },
      {
        label: "Menu",
        icon: Package,
        children: [
          { label: "Categories", icon: Tags },
          { label: "Foods", icon: UtensilsCrossed },
        ],
      },
      // { label: "Messages", icon: MessageSquare, badge: 4 },
      { label: "Payment", icon: CreditCard },
    ],
  },
  // {
  //   section: "System",
  //   items: [{ label: "Settings", icon: Settings }],
  // },
];

// DASH BOARD

const revenueTrend = [
  { day: "Mon", revenue: 6200 },
  { day: "Tue", revenue: 7100 },
  { day: "Wed", revenue: 5800 },
  { day: "Thu", revenue: 8300 },
  { day: "Fri", revenue: 9100 },
  { day: "Sat", revenue: 11400 },
  { day: "Sun", revenue: 8420 },
];

const recentOrders = [
  { table: "Table 4", status: "Served", payment: "Paid", amount: "₱220.00" },
  {
    table: "Table 7",
    status: "Preparing",
    payment: "Pending",
    amount: "₱235.00",
  },
  { table: "Table 2", status: "Served", payment: "Paid", amount: "₱455.00" },
  { table: "Table 9", status: "Ready", payment: "Pending", amount: "₱445.00" },
];

//  END OF DASH BOARD
// MODAL ID

const userFormModal = "userFormModal";
const categoryFormModal = "categoryFormModal";
const foodFormModal = "foodFormModal";

const CREATE_TABLE_MODAL = "create_table_modal";
const VIEW_TABLE_MODAL = "view_table_modal";
const UPDATE_TABLE_MODAL = "update_table_modal";

const PAGE_SIZE = 10;
let TOTAL_PAGES = 0;

function DashBoardContainer() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { auth, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    setDataLoading(true);
    async function DisplayDashBoardStats() {
      try {
        const data = await ShowDashBoardStats();
        setStats(data);
      } catch (err) {
        console.log(err);
      } finally {
        setDataLoading(false);
      }
    }

    DisplayDashBoardStats();
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    setDataLoading(true);
    async function RecentOrders() {
      try {
        const data = await ShowAllOrder();
        setOrders(data);
      } catch (err) {
        console.log(err);
      } finally {
        setDataLoading(false);
      }
    }

    RecentOrders();
  }, [loading]);

  return dataLoading ? (
    <p>loading</p>
  ) : (
    <div className="min-h-screen w-full bg-white p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <DashBoardStatsCard stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-lg border border-black/6 bg-[#FFF8F0] p-6">
            <p className="text-[13.5px] font-semibold text-[#8C5A3C] mb-4">
              Revenue this week
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueTrend}
                  margin={{ left: -20, right: 10 }}>
                  <CartesianGrid stroke="#C08552" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#8C5A3C" }}
                    tickLine={false}
                    axisLine={{ stroke: "#4B2E2B" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8C5A3C" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid rgba(0,0,0,0.06)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4B2E2B"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-black/6 bg-[#FFF8F0] p-6">
            <p className="text-[13.5px] font-semibold text-[#4B2E2B] mb-4">
              Recent orders
            </p>
            <div className="flex flex-col gap-3">
              {orders.slice(0, 4).map((order) => {
                const totalAmount = order.orders.reduce(
                  (sum, item) => sum + Number(item.price) * item.qty,
                  0,
                );

                return (
                  <div key={order.id} className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-box bg-[#4B2E2B] shrink-0">
                      <UtensilsCrossed size={14} className="text-[#C08552]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-[#4B2E2B] truncate">
                        {order.table}
                      </p>
                      <p className="text-[11px] text-[#8C5A3C]">
                        {order.order_status}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-semibold text-[#4B2E2B]">
                        ₱{totalAmount.toFixed(2)}
                      </p>
                      <p
                        className={`text-[11px] ${
                          order.payment_status === "Paid"
                            ? "text-emerald-600"
                            : "text-[#B5432D]"
                        }`}>
                        {order.payment_status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersList({ users, setUsers, userData, setUserData }) {
  async function HandleDelete(pk) {
    try {
      const data = await DeleteUser(pk);
      setUsers((prev) => prev.filter((u) => u.id !== pk));
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <table className="table">
      <thead className="bg-[#4B2E2B] text-[#FFF8F0]">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Role</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody className="text-[#4B2E2B]">
        {users.map((u) => (
          <tr
            key={u.id}
            className="border-b border-[#C08552]/30 transition-colors">
            <td>
              {u.first_name} {u.last_name}
            </td>
            <td>{u.email}</td>
            <td>{u.contact_number}</td>
            <td>{u.role_display}</td>
            <td>
              <div className="flex justify-around">
                <button
                  className="btn btn-xs sm:btn-sm bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none transition-colors"
                  onClick={() => {
                    document.getElementById("userFormModal").showModal();
                    setUserData(u);
                  }}>
                  <SquarePen size={24} />
                </button>
                <button
                  className="btn btn-xs sm:btn-sm bg-[#8C5A3C] hover:bg-[#4B2E2B] text-[#FFF8F0] border-none transition-colors"
                  onClick={() => HandleDelete(u.id)}>
                  <Trash2 size={24} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UsersContainer() {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  TOTAL_PAGES = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    async function AllUsers() {
      try {
        setLoading(true);
        const data = await GetAllUser(page, search, filter);
        setUsers(data.results);
        setCount(data.count);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }
    AllUsers();
  }, [page, search, filter]);

  return (
    <>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md bg-[#4B2E2B] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none transition-colors"
        onClick={() => {
          setUserData(null);
          document.getElementById("userFormModal").showModal();
        }}>
        Add User <UserPlus size={20} />
      </button>
      {/* SEARCH AND FILTER */}
      <div className="my-4 flex justify-between gap-3">
        <label className="input w-1/3 text-[#4B2E2B] bg-[#FFF8F0] border border-[#E8E0D2] overflow-hidden focus-within:border-[#C08552]">
          <Search className="text-[#8C5A3C]" size={18} />
          <input
            type="search"
            required
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="text-[#4B2E2B] placeholder:text-[#4B2E2B]"
          />
        </label>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select bg-[#FFF8F0] border-[#E8E0D2] text-[#8C5A3C] focus:border-[#C08552] focus:outline-[#4B2E2B]/20">
          <option value="">All</option>
          <option value="AD">Admin</option>
          <option value="CA">Cashier</option>
        </select>
      </div>
      {/*  */}
      <UserFormModal
        modal_id={userFormModal}
        userData={userData}
        setUserData={setUserData}
        setUsers={setUsers}
      />

      <div className="rounded-lg border border-black/6 bg-[#FFF8F0] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <UsersList
              users={users}
              setUsers={setUsers}
              userData={userData}
              setUserData={setUserData}
            />
          )}
        </div>
      </div>
      {/* PAGINATION */}
      {count > 0 && (
        <div className="join flex mt-4 p-4 gap-0.5">
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!prevUrl}
            onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft />
          </button>
          <span className="join-item btn btn-ghost bg-[#FFF8F0] text-[#8C5A3C] border-none pointer-events-none">
            {page} of {TOTAL_PAGES}
          </span>
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!nextUrl}
            onClick={() => setPage((p) => p + 1)}>
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}

function TableList({ tables, setTables, onViewTable, updateTableModal }) {
  async function HandleDelete(pk) {
    try {
      const data = await DeleteTable(pk);
      setTables((prev) => prev.filter((u) => u.id !== pk));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <table className="table">
      <thead className="bg-[#4B2E2B] text-[#FFF8F0]">
        <tr>
          <th>Table Number</th>
          <th>QR Link</th>
          <th>Status</th>
          <th>Created At</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody className="text-[#4B2E2B]">
        {tables.map((table) => (
          <tr
            key={table.id}
            className="hover:bg-[#FBF7EE] border-b border-[#C08552] transition-colors
">
            <td>{`${"T-"}${table.table_number}`}</td>
            <td>{table.qr_data}</td>
            <td>{table.status}</td>
            <td>{formatDateTime(table.created_at)}</td>
            <td>
              <div className="flex justify-around">
                <button
                  className="btn btn-xs sm:btn-sm bg-[#C08552] hover:bg-[#8C5A3C] hover:text-[#FFF8F0] text-[#FFF8F0] border-none transition-colors
"
                  onClick={() => updateTableModal(table.table_number)}>
                  <SquarePen size={24} />
                </button>
                <button
                  className="btn btn-xs sm:btn-sm bg-[#C08552] hover:bg-[#8C5A3C] hover:text-[#FFF8F0] text-[#FFF8F0] border-none transition-colors
"
                  onClick={() => onViewTable(table.table_number)}>
                  <Eye size={24} />
                </button>
                <button
                  className="btn btn-xs sm:btn-sm bg-[#8C5A3C] hover:bg-[#4B2E2B] hover:text-[#FFF8F0] text-[#FFF8F0] border-none transition-colors
"
                  onClick={() => HandleDelete(table.table_number)}>
                  <Trash2 size={24} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function TableContainer() {
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  TOTAL_PAGES = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    async function ShowAllTables() {
      try {
        setLoading(true);
        const tableNumber = parseInt(search);
        const data = await GetAllTable(page, tableNumber);
        setTables(data.results);
        setCount(data.count);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    ShowAllTables();
  }, [page, search]);

  const openViewModal = (id) => {
    setTableId(id);
    document.getElementById(VIEW_TABLE_MODAL).showModal();
  };
  const openUpdateModal = (id) => {
    setTableId(id);
    document.getElementById(UPDATE_TABLE_MODAL).showModal();
  };
  return (
    <>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md bg-[#4B2E2B] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none transition-colors"
        onClick={() => {
          document.getElementById(CREATE_TABLE_MODAL).showModal();
        }}>
        Add Table <Plus size={20} />
      </button>
      <div className="my-4 flex justify-between gap-3">
        <label className="input w-1/3 text-[#4B2E2B] bg-[#FFF8F0] border border-[#E8E0D2] overflow-hidden focus-within:border-[#C08552]">
          <Search className="text-[#8C5A3C]" size={18} />
          <input
            type="search"
            required
            value={search}
            placeholder="Search Table Number"
            onChange={(e) => setSearch(e.target.value)}
            className="text-[#4B2E2B] placeholder:text-[#4B2E2B]"
          />
        </label>
      </div>
      <CreateTableModal modal_id={CREATE_TABLE_MODAL} setTables={setTables} />
      <ViewTableModal modal_id={VIEW_TABLE_MODAL} tableId={tableId} />
      <UpdateTableModal
        modal_id={UPDATE_TABLE_MODAL}
        tableId={tableId}
        setTables={setTables}
      />

      <div className="rounded-lg border border-black/6 bg-[#FFF8F0] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <TableList
              tables={tables}
              setTables={setTables}
              onViewTable={openViewModal}
              updateTableModal={openUpdateModal}
            />
          )}
        </div>
      </div>
      {count > 0 && (
        <div className="join flex mt-4 p-4 gap-0.5">
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!prevUrl}
            onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft />
          </button>
          <span className="join-item btn btn-ghost bg-[#FFF8F0] text-[#8C5A3C] border-none pointer-events-none">
            {page} of {TOTAL_PAGES}
          </span>
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!nextUrl}
            onClick={() => setPage((p) => p + 1)}>
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}

function CategoryList({ categories, setCategories, setCategoryId }) {
  async function HandleDelete(pk) {
    try {
      const data = await DeleteCategory(pk);
      setCategories((prev) => prev.filter((u) => u.id !== pk));
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <table className="table">
      <thead className="bg-[#4B2E2B] text-[#FFF8F0]">
        <tr>
          <th>Category Name</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody className="text-[#4B2E2B]">
        {categories.map((c) => (
          <tr
            key={c.id}
            className="border-b border-[#C08552]/30 transition-colors">
            <td>{c.name}</td>
            <td>{formatDateTime(c.created_at)}</td>
            <td>{formatDateTime(c.updated_at)}</td>
            <td>
              <div className="flex justify-around">
                <button
                  className="btn btn-xs sm:btn-sm bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none transition-colors"
                  onClick={() => {
                    document.getElementById(categoryFormModal).showModal();
                    setCategoryId(c.id);
                  }}>
                  <SquarePen size={18} />
                </button>
                <button
                  className="btn btn-xs sm:btn-sm bg-[#8C5A3C] hover:bg-[#4B2E2B] text-[#FFF8F0] border-none transition-colors"
                  onClick={() => HandleDelete(c.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function CategoriesContainer() {
  const [categories, setCategories] = useState([]);
  const [dropDownCategories, setDropDownCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    async function fetchDropDownCategories() {
      try {
        setLoading(true);
        const data = await LoadCategories();
        setDropDownCategories(data.results);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDropDownCategories();
  }, []);

  useEffect(() => {
    async function AllCategories() {
      try {
        setLoading(true);
        const data = await LoadCategories(page, filterName);
        setCategories(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        setCount(data.count);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }
    AllCategories();
  }, [page, filterName]);

  return (
    <>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md bg-[#4B2E2B] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none transition-colors"
        onClick={() => {
          document.getElementById(categoryFormModal).showModal();
        }}>
        Add Category <FolderPlus size={20} />
      </button>

      {/* DROP DOWN FILTER */}
      <div className="my-4">
        <select
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="select bg-[#FFF8F0] border-[#E8E0D2] text-[#8C5A3C] focus:border-[#C08552] focus:outline-[#4B2E2B]/20">
          <option value="">All</option>
          {dropDownCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {/*  */}

      <CategoryFormModal
        modal_id={categoryFormModal}
        setCategories={setCategories}
        category_id={categoryId}
      />

      <div className="rounded-lg border border-black/6 bg-[#FFF8F0] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <CategoryList
              categories={categories}
              setCategories={setCategories}
              setCategoryId={setCategoryId}
            />
          )}
        </div>
      </div>
      {/* PAGINATION */}
      {count > 0 && (
        <div className="join flex mt-4 p-4 gap-0.5">
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!prevUrl}
            onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft />
          </button>
          <span className="join-item btn btn-ghost bg-[#FFF8F0] text-[#8C5A3C] border-none pointer-events-none">
            {page} of {totalPages}
          </span>
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!nextUrl}
            onClick={() => setPage((p) => p + 1)}>
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}

function FoodList({ foods, setFoods, setFoodId }) {
  async function HandleDelete(pk) {
    try {
      const data = await DeleteFood(pk);
      setFoods((prev) => prev.filter((u) => u.id !== pk));
    } catch (err) {
      console.error(err);
    }
  }

  async function HandleStatus(pk, currentStatus) {
    try {
      const payload = {
        is_active: !currentStatus,
      };
      const data = await ChangeStatus(payload, pk);
      setFoods((prev) =>
        prev.map((food) => (food.id === data.id ? data : food)),
      );
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <table className="table">
      <thead className="bg-[#4B2E2B] text-[#FFF8F0]">
        <tr>
          <th>Food Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Status</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody className="text-[#4B2E2B]">
        {foods.map((food) => (
          <tr
            key={food.id}
            className="border-b border-[#C08552]/30 transition-colors">
            <td>{food.name}</td>
            <td>{food.category}</td>
            <td>{formatPrice(food.price)}</td>
            <td>{formatDateTime(food.created_at)}</td>
            <td>{formatDateTime(food.updated_at)}</td>
            <td className="flex justify-center">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  food.is_active
                    ? "bg-[#E6EFE3] text-[#3D6640]"
                    : "bg-[#F7E4E0] text-[#8C3624]"
                }`}>
                {food.is_active ? (
                  <>
                    <CircleCheck size={14} /> Active
                  </>
                ) : (
                  <>
                    <CircleX size={14} /> Inactive
                  </>
                )}
              </span>
            </td>

            <td>
              <div className="flex justify-around">
                <button
                  className="btn btn-xs sm:btn-sm bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none transition-colors"
                  onClick={() => {
                    document.getElementById(foodFormModal).showModal();
                    setFoodId(food.id);
                  }}>
                  <SquarePen size={18} />
                </button>
                <button
                  className="btn btn-xs sm:btn-sm bg-[#8C5A3C] hover:bg-[#4B2E2B] text-[#FFF8F0] border-none transition-colors"
                  onClick={() => HandleDelete(food.id)}>
                  <Trash2 size={18} />
                </button>

                <button
                  className={`btn btn-xs sm:btn-sm border-none transition-colors ${
                    food.is_active
                      ? "bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0]"
                      : "bg-[#8C5A3C] hover:bg-[#4B2E2B] text-[#FFF8F0]"
                  }`}
                  onClick={() => HandleStatus(food.id, food.is_active)}>
                  {food.is_active ? (
                    <ToggleRight size={18} />
                  ) : (
                    <ToggleLeft size={18} />
                  )}
                  <span className="ml-2">
                    {food.is_active ? "Active" : "Inactive"}
                  </span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function FoodContainer() {
  const [foods, setFoods] = useState([]);
  const [foodId, setFoodId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);
  const [dropDownCategories, setDropDownCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  TOTAL_PAGES = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    async function fetchDropDownCategories() {
      try {
        setLoading(true);
        const data = await LoadCategories();
        setDropDownCategories(data.results);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDropDownCategories();
  }, []);

  useEffect(() => {
    async function ShowAllFoods() {
      try {
        setLoading(true);
        const data = await GetAllFood(page, filter, search);
        setFoods(data.results);
        setCount(data.count);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    ShowAllFoods();
  }, [page, filter, search]);
  return (
    <>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md bg-[#4B2E2B] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none transition-colors"
        onClick={() => {
          setFoodId(null);
          document.getElementById(foodFormModal).showModal();
        }}>
        Add Food <Plus size={20} />
      </button>
      <FoodFormModal
        modal_id={foodFormModal}
        setFoods={setFoods}
        food_id={foodId}
      />
      {/* SEARCH + FILTER — one row, right-aligned */}
      <div className="my-4 flex justify-between gap-3">
        <label className="input w-1/3 text-[#4B2E2B] bg-[#FFF8F0] border border-[#E8E0D2] overflow-hidden focus-within:border-[#C08552]">
          <Search className="text-[#8C5A3C]" size={18} />
          <input
            type="search"
            required
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="text-[#4B2E2B] placeholder:text-[#4B2E2B]"
          />
        </label>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select bg-[#FFF8F0] border-[#E8E0D2] text-[#8C5A3C] focus:border-[#C08552] focus:outline-[#4B2E2B]/20">
          <option value="">All</option>
          {dropDownCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {/*  */}
      <div className="rounded-lg border border-black/6 bg-[#FFF8F0] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <FoodList foods={foods} setFoods={setFoods} setFoodId={setFoodId} />
          )}
        </div>
      </div>
      {count > 0 && (
        <div className="join flex mt-4 p-4 gap-0.5">
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!prevUrl}
            onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft />
          </button>
          <span className="join-item btn btn-ghost bg-[#FFF8F0] text-[#8C5A3C] border-none pointer-events-none">
            {page} of {TOTAL_PAGES}
          </span>
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!nextUrl}
            onClick={() => setPage((p) => p + 1)}>
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}

function PaymentRecordList({ payments, updateTableModal }) {
  return (
    <div className="bg-[#FFF8F0] rounded-box shadow-md">
      <ul className="list">
        {payments.length === 0 ? (
          <li className="p-10 text-center text-sm text-[#8C5A3C]">
            No payment records match your search.
          </li>
        ) : (
          payments.map((payment) => (
            <li
              key={payment.id}
              className="border-b border-[#8C5A3C] text-[#8C5A3C]">
              <div
                className="list-row items-center cursor-pointer hover:bg-[#C08552] transition-colors p-4"
                onClick={() => updateTableModal(payment.id)}>
                <div className="flex size-10 items-center justify-center rounded-box bg-[#4B2E2B]">
                  <UtensilsCrossed size={18} className="text-[#8C5A3C]" />
                </div>

                <div className="list-col-grow">
                  <div className="font-medium">{payment.table_order.table}</div>
                  <div className="text-xs uppercase font-semibold text-[#C08552]">
                    {payment.table_order.order_status} &middot;{" "}
                    {formatDateTime(payment.created_at)}
                  </div>
                  <div className="text-xs text-[#8C7E68] mt-0.5">
                    Processed by:{" "}
                    <span className="font-medium text-[#4B2E2B]">
                      {payment.cashier || "Unknown"}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    payment.table_order.payment_status
                      ? "bg-[#E6EFE3] text-[#3D6640]"
                      : "bg-[#FBF0D9] text-[#8A6A1F]"
                  }`}>
                  {payment.table_order.payment_status}
                </div>

                <div className="w-24 text-right font-semibold tabular-nums">
                  ₱{Number(payment.total_amount).toFixed(2)}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
function PaymentContainer() {
  const [payments, setPayments] = useState([]);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  TOTAL_PAGES = Math.ceil(count / PAGE_SIZE);
  useEffect(() => {
    async function ShowAllPayment() {
      try {
        setLoading(true);
        const data = await ShowAllPaymentRecords(
          page,
          search,
          statusFilter,
          dateFrom,
          dateTo,
        );
        setPayments(data.results);
        setCount(data.count);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    ShowAllPayment();
  }, [page, search, statusFilter, dateFrom, dateTo]);

  // const openViewModal = (id) => {
  //   setPaymentId(id);
  //   document.getElementById(VIEW_TABLE_MODAL).showModal();
  // };
  const openUpdateModal = (id) => {
    setPaymentId(id);
    document.getElementById(UPDATE_TABLE_MODAL).showModal();
  };
  return (
    <>
      {/* <button
        className="btn btn-xs sm:btn-sm md:btn-md"
        onClick={() => {
          document.getElementById(CREATE_TABLE_MODAL).showModal();
        }}>
        Create <UserPlus size={24} />
      </button> */}
      {/* <CreateTableModal modal_id={CREATE_TABLE_MODAL} setTables={setTables} /> */}
      <PaymentFormModal
        modal_id={UPDATE_TABLE_MODAL}
        paymentId={paymentId}
        setPayments={setPayments}
      />
      {/* <UpdateTableModal
        modal_id={UPDATE_TABLE_MODAL}
        tableId={tableId}
        setTables={setTables}
      /> */}

      {/* Controls */}
      <div className="bg-[#FFF8F0] flex flex-col sm:flex-row gap-3 p-4 pb-2">
        <label className="input flex items-center gap-2 flex-1 bg-[#FFF8F0] border border-[#E8E0D2] focus-within:border-[#C08552]">
          <Search size={16} className="text-[#8C5A3C]" />
          <input
            type="text"
            className="grow text-[#4B2E2B] placeholder:text-[#4B2E2B]"
            placeholder="Search by table"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="join">
          {["all", "Paid", "Unpaid"].map((key) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`mx-2 btn btn-sm join-item capitalize border ${
                statusFilter === key
                  ? "bg-[#C08552] text-[#FFF8F0] border-[#C08552]"
                  : "bg-[#FFF8F0] text-[#4B2E2B] border-[#8C5A3C] hover:bg-[#C08552] hover:text-[#FFF8F0]"
              }`}>
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Date range filter */}
      <div className="bg-[#FFF8F0] flex flex-col sm:flex-row items-start sm:items-center gap-2 px-4 pb-4">
        <span className="text-xs font-semibold uppercase text-[#4B2E2B]">
          Date range
        </span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="input input-sm bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552]"
        />
        <span className="text-[#8C5A3C] text-sm">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="input input-sm bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552]"
        />
        {(dateFrom || dateTo) && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="text-xs text-[#C08552] hover:text-[#8C5A3C] hover:underline">
            Clear
          </button>
        )}
      </div>

      <div className="rounded-lgrounded-lg border border-black/6 bg-[#FFF8F0] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <PaymentRecordList
              payments={payments}
              setPayments={setPayments}
              updateTableModal={openUpdateModal}
            />
          )}
        </div>
      </div>
      {count > 0 && (
        <div className="join flex mt-4 p-4 gap-0.5">
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!prevUrl}
            onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft />
          </button>
          <span className="join-item btn btn-ghost bg-[#FFF8F0] text-[#8C5A3C] border-none pointer-events-none">
            {page} of {TOTAL_PAGES}
          </span>
          <button
            className="join-item btn bg-[#4B2E2B] hover:bg-[#C08552] text-[#FFF8F0] border-none disabled:opacity-30 disabled:bg-[#8C5A3C]"
            disabled={!nextUrl}
            onClick={() => setPage((p) => p + 1)}>
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- Content per nav item ----------
   Add one entry per label (including sub-items). Whatever you
   return here is what renders in <main> when that item is active. */
const pageContent = {
  Dashboard: () => <DashBoardContainer />,
  Users: () => <UsersContainer />,
  Tables: () => <TableContainer />,
  // "All items": () => (
  //   <p className="text-[13.5px] text-[#8C887E]">Full product list here.</p>
  // ),
  Categories: () => <CategoriesContainer />,
  Foods: () => <FoodContainer />,
  Inventory: () => (
    <p className="text-[13.5px] text-[#8C887E]">Stock levels here.</p>
  ),
  Payment: () => <PaymentContainer />,
  Messages: () => (
    <p className="text-[13.5px] text-[#8C887E]">Inbox / message thread here.</p>
  ),
  Settings: () => (
    <p className="text-[13.5px] text-[#8C887E]">Account & app settings here.</p>
  ),
};
/* ------------------------------------------- */

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [openGroup, setOpenGroup] = useState("Products");
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || !user) return null;
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const CurrentContent =
    pageContent[active] ||
    (() => (
      <p className="text-[13.5px] text-[#A8977E]">
        No content wired up for "{active}" yet — add it to{" "}
        <code>pageContent</code>.
      </p>
    ));

  return (
    <div className="flex h-screen bg-white font-sans">
      <aside
        className={`relative flex flex-col shrink-0 bg-[#2B2018] text-[#EFE6D8] transition-all duration-300 ease-in-out ${
          collapsed ? "w-18" : "w-62"
        }`}>
        {/* Brand */}
        <div className="flex items-center h-16 px-4 border-b border-white/8 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#8C5A3C] text-[#2B2018] font-bold text-sm shrink-0">
            <UtensilsCrossed />
          </div>
          {!collapsed && (
            <span className="ml-3 text-[15px] tracking-tight font-semibold text-white whitespace-nowrap overflow-hidden">
              Eat N Dash
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {nav.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p className="px-2 mb-2 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#A8977E]">
                  {group.section}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.label;
                  const hasChildren = !!item.children;
                  const isOpen = openGroup === item.label;

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => {
                          if (hasChildren) {
                            if (!collapsed)
                              setOpenGroup(isOpen ? null : item.label);
                            return;
                          }
                          setActive(item.label);
                        }}
                        className={`group relative w-full flex items-center gap-3 rounded-md px-2.5 py-2 text-[13.5px] transition-colors duration-150 ${
                          isActive
                            ? "bg-[#3D2E20] text-white"
                            : "text-[#C7B8A2] hover:bg-[#352819] hover:text-white"
                        }`}
                        title={collapsed ? item.label : undefined}>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.75 rounded-full bg-[#E0722C]" />
                        )}
                        <Icon
                          size={17}
                          strokeWidth={1.75}
                          className="shrink-0"
                        />
                        {!collapsed && (
                          <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.label}
                          </span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="text-[10.5px] font-semibold bg-[#E0722C] text-[#2B2018] rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                            {item.badge}
                          </span>
                        )}
                        {!collapsed && hasChildren && (
                          <ChevronDown
                            size={14}
                            className={`shrink-0 text-[#A8977E] transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {hasChildren && !collapsed && isOpen && (
                        <div className="mt-0.5 ml-6.75 pl-3 border-l border-white/8 space-y-0.5">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = active === child.label;

                            return (
                              <button
                                key={child.label}
                                onClick={() => setActive(child.label)}
                                className={`w-full flex items-center gap-2 text-left rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150 ${
                                  isChildActive
                                    ? "text-white"
                                    : "text-[#B3A28A] hover:text-white"
                                }`}>
                                {ChildIcon && (
                                  <ChildIcon
                                    size={14}
                                    strokeWidth={1.75}
                                    className="shrink-0"
                                  />
                                )}
                                <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                  {child.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/8 p-3 space-y-0.5 shrink-0">
          <div
            className={`flex items-center gap-2.5 rounded-md px-2 py-2 mt-1 ${
              collapsed ? "justify-center" : ""
            }`}>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-md text-white truncate leading-tight">
                  {user.username}
                </p>
                <p className="text-sm text-[#A8977E] truncate leading-tight">
                  Admin
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="text-[#A8977E] hover:text-white transition-colors cursor-pointer">
                <LogOut size={20} strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6.5 w-6 h-6 rounded-full bg-[#2B2018] border border-white/12 flex items-center justify-center text-[#C7B8A2] hover:text-white hover:bg-[#3D2E20] transition-colors">
          {collapsed ? (
            <ChevronsRight size={13} strokeWidth={2} />
          ) : (
            <ChevronsLeft size={13} strokeWidth={2} />
          )}
        </button>
      </aside>

      {/* Preview content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-[#2B2018] tracking-tight mb-6">
            {active}
          </h1>
          <CurrentContent />
        </div>
      </main>
    </div>
  );
}
