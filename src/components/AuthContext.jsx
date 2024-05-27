import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .post("http://localhost:8080/api/auth/verifyToken")
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", response.data.token);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser({ username });
  };

  const register = async (username, password) => {
    const response = await axios.post(
      "http://localhost:8080/api/auth/register",
      {
        username,
        password,
      }
    );
    localStorage.setItem("token", response.data.token);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
