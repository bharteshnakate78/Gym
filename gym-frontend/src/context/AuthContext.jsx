import React, { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE LOGIN SESSION
  // ==========================================
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (
        token &&
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (credentials) => {
    try {
      console.log("=================================");
      console.log("LOGIN REQUEST");
      console.log("Email:", credentials.email);
      console.log("=================================");

      // Clear old authentication
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const response = await api.post("/auth/login", {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const data = response.data;

      if (!data?.token) {
        throw new Error("Backend did not return JWT token");
      }

      const normalizedRole = String(data.role || "USER")
        .replace("ROLE_", "")
        .toUpperCase();

      const loggedInUser = {
        id: data.userId ?? data.id,
        userId: data.userId ?? data.id,
        name: data.name,
        email: data.email,
        role: normalizedRole,
        status: data.status ?? "ACTIVE",
      };

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Update React state
      setUser(loggedInUser);

      console.log("AUTHENTICATED USER:", loggedInUser);

      return data;
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      console.error("Status:", error.response?.status);

      console.error("Backend response:", error.response?.data);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);

      throw error;
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      return response.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      throw error;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ==========================================
  // REFRESH USER
  // ==========================================
  const refreshUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);

      setUser(null);
    }
  };

  // ==========================================
  // AUTHENTICATION STATUS
  // ==========================================
  const isAuthenticated =
    Boolean(user) && Boolean(localStorage.getItem("token"));

  // ==========================================
  // PROVIDER
  // ==========================================
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        refreshUser,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// useAuth HOOK
// ==========================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth() must be used inside <AuthProvider>");
  }

  return context;
};

export default AuthContext;
