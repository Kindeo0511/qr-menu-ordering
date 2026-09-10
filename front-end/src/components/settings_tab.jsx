import { useState, useEffect } from "react";
import { useAuth } from "../auth/user_auth";
import {
  UserProfile,
  UpdateProfile,
  ChangePassword,
} from "../services/user_service";
import { User, Lock, Eye, EyeOff, Save, KeyRound } from "lucide-react";

function ProfileTab() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await UserProfile();
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          contact_number: data.contact_number || "",
        });
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Couldn't load your profile." });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await UpdateProfile(form);
      setUser?.(updated);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.message || "Couldn't save your changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-[#8C5A3C] text-sm py-10 text-center">
        Loading profile…
      </p>
    );
  }

  const initials =
    `${form.first_name?.[0] || ""}${form.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#C08552] text-white flex items-center justify-center text-xl font-bold shrink-0">
          {initials || <User size={28} />}
        </div>
        <div>
          <p className="font-semibold text-[#4B2E2B] text-lg">
            {form.first_name} {form.last_name}
          </p>
          <p className="text-sm text-[#8C5A3C]">{user?.role_display}</p>
        </div>
      </div>

      {message && (
        <div
          className={`text-sm rounded-lg px-3 py-2.5 mb-4 font-medium ${
            message.type === "success"
              ? "bg-[#E6EFE3] text-[#3D6640]"
              : "bg-[#F7E4E0] text-[#8C3624]"
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
              First name
            </label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="input w-full bg-white border border-[#C08552]/30 text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
              Last name
            </label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="input w-full bg-white border border-[#C08552]/30 text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input w-full bg-white border border-[#C08552]/30 text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
            Contact number
          </label>
          <input
            type="tel"
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            className="input w-full bg-white border border-[#C08552]/30 text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-white border-none disabled:opacity-50 mt-2 self-start px-6">
          <Save size={16} />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({
    password: "",
    confirm_password: "",
  });
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (form.password !== form.confirm_password) {
      setMessage({ type: "error", text: "New passwords don't match." });
      return;
    }
    if (form.password.length < 8) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters.",
      });
      return;
    }

    setSaving(true);
    try {
      await ChangePassword({ password: form.password });
      setMessage({ type: "success", text: "Password changed successfully." });
      setForm({ password: "", confirm_password: "" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.message || "Couldn't change your password.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#C08552]/10 flex items-center justify-center shrink-0">
          <KeyRound className="text-[#C08552]" size={22} />
        </div>
        <div>
          <p className="font-semibold text-[#4B2E2B]">Change your password</p>
          <p className="text-sm text-[#8C5A3C]">
            Use at least 8 characters, mixing letters and numbers.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`text-sm rounded-lg px-3 py-2.5 mb-4 font-medium ${
            message.type === "success"
              ? "bg-[#E6EFE3] text-[#3D6640]"
              : "bg-[#F7E4E0] text-[#8C3624]"
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
            New password
          </label>
          <label className="input w-full bg-white border border-[#C08552]/30 focus-within:border-[#C08552] flex items-center gap-2">
            <Lock size={16} className="text-[#C08552]" />
            <input
              type={showNew ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              className="grow text-[#4B2E2B]"
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="text-[#8C5A3C] hover:text-[#C08552]">
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#8C5A3C] mb-1.5">
            Confirm new password
          </label>
          <input
            type={showNew ? "text" : "password"}
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            minLength={8}
            className="input w-full bg-white border border-[#C08552]/30 text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-white border-none disabled:opacity-50 mt-2 self-start px-6">
          <Save size={16} />
          {saving ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
export function SettingsTab() {
  return (
    <div className="rounded-lg border border-black/6 bg-white overflow-hidden">
      <div className="tabs tabs-border bg-[#4B2E2B]/5 px-4 pt-2">
        <input
          type="radio"
          name="settings_tabs"
          className="tab text-[#8C5A3C] [--tab-color:#8C5A3C] checked:text-[#C08552] checked:[--tab-color:#C08552] transition-colors"
          aria-label="My Profile"
          defaultChecked
        />
        <div className="tab-content border-base-300 bg-white p-8">
          <ProfileTab />
        </div>

        <input
          type="radio"
          name="settings_tabs"
          className="tab text-[#8C5A3C] [--tab-color:#8C5A3C] checked:text-[#C08552] checked:[--tab-color:#C08552] transition-colors"
          aria-label="Change Password"
        />
        <div className="tab-content border-base-300 bg-white p-8">
          <PasswordTab />
        </div>
      </div>
    </div>
  );
}
