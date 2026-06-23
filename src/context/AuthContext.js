import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const MOCK_USER = {
  id: "user-001",
  name: "Alex Johnson",
  email: "alex@example.com",
  password: "demo123",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const { password: _, ...safeUser } = MOCK_USER;
      setUser(safeUser);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  }

  async function register(name, email, password) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!name || !email || !password) {
      return { success: false, error: "All fields are required." };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }

    setUser({ id: "user-new", name, email });
    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
