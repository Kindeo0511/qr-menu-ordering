import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { setAccessToken as setTokenStore } from "../api/tokenStore";
import { GetCurrentUser } from "../services/user_service";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  function setAccessToken(token) {
    setAccessTokenState(token);
    setTokenStore(token);
  }

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setLoading(false);
      return;
    }
    async function restoreSession() {
      setLoading(true);
      try {
        const res = await api.post("api/refresh/token/");
        setAccessToken(res.data.access);
        setAuth({ access: res.data.access });
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
  }, []);

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
      const data = await api.post("/api/logout/");
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
