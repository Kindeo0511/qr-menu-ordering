import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // adjust if using a different router
import api from "../api/axios";
import { setAccessToken as setTokenStore } from "../api/tokenStore";
import { GetCurrentUser } from "../services/user_service";

const AuthContext = createContext(null);
const PUBLIC_ROUTES = ["/", "/secret-kitchen"];

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const hasAttemptedRestore = useRef(false);

  function setAccessToken(token) {
    setAccessTokenState(token);
    setTokenStore(token);
  }

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    if (hasAttemptedRestore.current) return;
    hasAttemptedRestore.current = true;

    async function restoreSession() {
      setLoading(true);
      try {
        const res = await api.post("api/refresh/token/");
        setAccessToken(res?.data?.access);
        setAuth({ access: res?.data?.access });
        const userData = await GetCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Session restore failed", err);
        setAuth(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [location.pathname]);

  async function login(payload) {
    const response = await api.post("api/login/", payload);
    setAccessToken(response.data.access);

    setAuth({
      access: response.data.access,
      username: response.data.username,
      role: response.data.role,
    });
    const userData = await GetCurrentUser();
    setUser(userData);

    return response.data;
  }

  async function logout() {
    setLoading(true);
    try {
      await api.post("/api/logout/");
    } finally {
      setAccessToken(null);
      setAuth(null);
      setUser(null);
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, auth, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
