import { createContext, useContext, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem("auth"));
    if (saved && new Date(saved.expiresAt) > new Date()) return saved;
  } catch {
    // ignore bad data
  }
  localStorage.removeItem("auth");
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSaved);

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("auth", JSON.stringify(res.data));
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);