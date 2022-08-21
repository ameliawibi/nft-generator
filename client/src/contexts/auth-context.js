import { useState, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import getCookie from "../utils/getCookie";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(getCookie("x-access-token"));

  const handleLogin = async (data) => {
    const response = await axios.post("/auth/signin", data);

    const origin = location.state?.from?.pathname || "/collection";

    if (response.status === 200) {
      setToken(response.data.accessToken);
      navigate(origin);
    }
  };

  const handleLogout = async () => {
    const response = await axios.get("/auth/logout");
    if (response.status === 200) {
      setToken(null);
    }
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
