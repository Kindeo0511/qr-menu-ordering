import { useState } from "react";
import { useAuth } from "../auth/user_auth";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
function Login_Page({
  setUser,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth, login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { username, password };
      const data = await login(payload);

      if (data.role === "AD" || data.role === "ST") {
        navigate("/admin-dashboard");
      } else if (data.role === "CA") {
        navigate("/secret-cashier");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between bg-[#4B2E2B] text-[#FFF8F0] p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C08552]/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#8C5A3C]/10 blur-3xl"></div>

        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#8C5A3C] text-[#2B2018] font-bold text-sm shrink-0">
            <UtensilsCrossed />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Eat N Dash
          </span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Run your floor, not just your till.
          </h1>
          <p className="text-[#FFF8F0]/80 text-base max-w-sm leading-relaxed">
            Take orders, fire tickets to the kitchen, and close out payments all
            from one place built for how restaurants actually move.
          </p>

          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-[#FFF8F0]/20">
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-xs text-[#FFF8F0]/70 uppercase tracking-wide mt-1">
                Order tracking
              </div>
            </div>
            <div className="w-px h-8 bg-[#FFF8F0]/20"></div>
            <div>
              <div className="text-2xl font-bold">Live</div>
              <div className="text-xs text-[#FFF8F0]/70 uppercase tracking-wide mt-1">
                Kitchen display
              </div>
            </div>
            <div className="w-px h-8 bg-[#FFF8F0]/20"></div>
            <div>
              <div className="text-2xl font-bold">QR</div>
              <div className="text-xs text-[#FFF8F0]/70 uppercase tracking-wide mt-1">
                Table ordering
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-[#C08552]">
          Eat N Dash. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex items-center justify-center bg-[#FFF8F0] p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#C08552] text-[#4B2E2B] font-bold text-lg flex items-center justify-center">
              <UtensilsCrossed size="20" />
            </div>
            <span className="text-lg font-semibold text-[#4B2E2B] tracking-tight">
              Eat N Dash
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#4B2E2B] mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-[#8C5A3C] mb-8">
            Sign in to manage orders
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium text-[#4B2E2B]"
                  htmlFor="password">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs text-[#C08552] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20 pr-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#8C5A3C] hover:text-[#C08552] transition-colors">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-[#C08552]/20 border border-[#C08552] px-3 py-2.5 text-sm text-[#4B2E2B]">
                {error}
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-sm border-[#8C5A3C] [--chkbg:#C08552] [--chkfg:#FFF8F0] checked:border-[#C08552]"
              />
              <span className="text-sm text-[#8C5A3C]">Keep me signed in</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none disabled:opacity-50 h-12 mt-1">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in…
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login_Page;
