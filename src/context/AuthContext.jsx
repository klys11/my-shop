import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, fetchMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchMe();
        setUser(res.user);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email, password) {
    const res = await loginUser(email, password);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res;
  }

  async function register(name, email, password) {
    const res = await registerUser(name, email, password);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
