import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadCurrentUser(token);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const loadCurrentUser = async (authToken) => {
    const response = await fetch(API + "/users/me", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      setUser(null);
      return null;
    }

    const userData = await response.json();
    setUser(userData);
    return userData;
  };

  const register = async (credentials) => {
    const response = await fetch(API + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.text();
    if (!response.ok) throw Error(result);
    setToken(result);
    return await loadCurrentUser(result);
  };

  const login = async (credentials) => {
    const response = await fetch(API + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.text();
    if (!response.ok) throw Error(result);
    setToken(result);
    return await loadCurrentUser(result);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = { token, register, login, logout, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
