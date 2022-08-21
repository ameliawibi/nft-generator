import { useState, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(null);

  const handleLogin = async (data) => {
    const response = await axios.post("/auth/signin", data);

    const origin = location.state?.from?.pathname || "/collection";

    if (response.status === 200) {
      console.log("Login success");
      setToken(response.data.accessToken);
      navigate(origin);
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
