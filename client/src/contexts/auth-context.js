import { useState, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import getCookie from "../utils/getCookie";

export const AuthContext = createContext({
  token: "",
  message: "",
  onLogin: () => Promise.resolve(),
  onLogout: () => Promise.resolve(),
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(getCookie("x-access-token"));
  const [message, setMessage] = useState(null);

  const handleLogin = async (data) => {
    try {
      const response = await axios.post("/auth/signin", data);

      const origin = location.state?.from?.pathname || "/collection";

      if (response.status === 200) {
        setToken(response.data.accessToken);
        setMessage(response.data.message);

        navigate(origin);
      }
    } catch (e) {
      setMessage(e.response.data.message);
    }
  };

  const handleLogout = async () => {
    const response = await axios.get("/auth/logout");
    if (response.status === 200) {
      window.location.reload();
      setToken(null);
    }
  };

  const value = {
    token,
    message,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
