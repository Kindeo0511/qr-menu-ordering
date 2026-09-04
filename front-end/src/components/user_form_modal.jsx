import { useState, useEffect } from "react";
import { AddUser, UpdateUser } from "../services/user_service";

function UserFormModal({ modal_id, userData, setUserData, setUsers }) {
  const emptyForm = {
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    email: userData?.email || "",
    contact_number: userData?.contact_number || "",
    username: userData?.username || "",
    password: "",
    role: userData?.role || "",
  };

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(userData?.id);

  useEffect(() => {
    if (userData) {
      setForm({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        contact_number: userData.contact_number || "",
        username: userData.username || "",
        password: "",
        role: userData.role || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  function ClearFields() {
    setForm(emptyForm);
    setError({});
  }

  async function HandleSubmit(e) {
    e.preventDefault();
    setError({});
    setLoading(true);

    const payload = { ...form };
    if (isEditMode && !payload.password) {
      delete payload.password;
    }

    try {
      if (isEditMode) {
        const updatedUser = await UpdateUser(payload, userData.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        );
      } else {
        const newUser = await AddUser(payload);
        setUsers((prev) => [...prev, newUser]);
      }

      ClearFields();
      document.getElementById(modal_id).close();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "input w-full bg-white border border-[#E8E0D2] text-[#2B2018] focus:border-[#E0722C] focus:outline-[#E0722C]/20";
  const labelClass = "text-sm font-medium text-[#2B2018]";
  const errorClass = "text-[#B4432F] text-xs mt-0.5";

  return (
    <dialog id={modal_id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-2xl bg-[#FFF8F0]">
        <h3 className="text-lg font-semibold text-[#4B2E2B] mb-4">
          {isEditMode ? "Edit User" : "Add User"}
        </h3>

        <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
          {/* First & Last Name side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="first_name">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
                placeholder="Enter first name"
                value={form.first_name}
                onChange={handleChange}
              />
              {error?.first_name && (
                <p className="text-[#C08552] text-xs mt-0.5">
                  {error.first_name}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="last_name">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
                placeholder="Enter last name"
                value={form.last_name}
                onChange={handleChange}
              />
              {error?.last_name && (
                <p className="text-[#C08552] text-xs mt-0.5">
                  {error.last_name}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <label
              className="text-sm font-medium text-[#4B2E2B]"
              htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
            {error?.email && (
              <p className="text-[#C08552] text-xs mt-0.5">{error.email}</p>
            )}
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <label
              className="text-sm font-medium text-[#4B2E2B]"
              htmlFor="contact_number">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact_number"
              name="contact_number"
              className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
              placeholder="Enter contact number"
              value={form.contact_number}
              onChange={handleChange}
            />
            {error?.contact_number && (
              <p className="text-[#C08552] text-xs mt-0.5">
                {error.contact_number}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
              />
              {error?.username && (
                <p className="text-[#C08552] text-xs mt-0.5">
                  {error.username}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="select w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20">
                <option value="" disabled>
                  Choose Role
                </option>
                <option value="AD">Admin</option>
                <option value="CA">Cashier</option>
              </select>
              {error?.role && (
                <p className="text-[#C08552] text-xs mt-0.5">{error.role}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <label
              className="text-sm font-medium text-[#4B2E2B]"
              htmlFor="password">
              Password
              {isEditMode && (
                <span className="text-xs text-[#8C5A3C] font-normal ml-1">
                  (leave blank to keep current password)
                </span>
              )}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
            {error?.password && (
              <p className="text-[#C08552] text-xs mt-0.5">{error.password}</p>
            )}
          </div>

          <div className="modal-action flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="btn bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] hover:bg-[#C08552] hover:text-[#FFF8F0]"
              onClick={() => {
                document.getElementById(modal_id).close();
                ClearFields();
              }}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none disabled:opacity-50"
              disabled={loading}>
              {loading
                ? "Submitting..."
                : isEditMode
                  ? "Save Changes"
                  : "Add User"}
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

export default UserFormModal;
