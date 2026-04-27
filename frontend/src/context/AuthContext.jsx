import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "techmarket_auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: "", user: null };
  });

  const isAuthenticated = Boolean(auth.token);
  const isAdmin = auth.user?.role === "admin";

  useEffect(() => {
    setAuthToken(auth.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  async function register(payload) {
    const response = await api.post("/auth/register", payload);
    setAuth(response.data.data);
    return response.data.data;
  }

  async function login(payload) {
    const response = await api.post("/auth/login", payload);
    setAuth(response.data.data);
    return response.data.data;
  }

  async function loadProfile() {
    if (!auth.token) return null;
    const response = await api.get("/auth/profile");
    setAuth((prev) => ({ ...prev, user: response.data.data }));
    return response.data.data;
  }

  async function updateProfile(payload) {
    const response = await api.put("/auth/profile", payload);
    setAuth(response.data.data);
    return response.data.data;
  }

  function logout() {
    setAuth({ token: "", user: null });
  }

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated,
      isAdmin,
      register,
      login,
      logout,
      loadProfile,
      updateProfile,
    }),
    [auth, isAuthenticated, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
