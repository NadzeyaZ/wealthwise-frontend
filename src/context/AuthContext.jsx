import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../../api/wealthwise";

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
    const userData = await getCurrentUser(authToken);
    if (!userData) {
      setUser(null);
      return null;
    }

    setUser(userData);
    return userData;
  };

  const register = async (credentials) => {
    const newToken = await registerUser(credentials);
    setToken(newToken);
    return loadCurrentUser(newToken);
  };

  const login = async (credentials) => {
    const newToken = await loginUser(credentials);
    setToken(newToken);
    return loadCurrentUser(newToken);
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
