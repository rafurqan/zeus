import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, clearToken } from "@/utils/storage";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(getToken());
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      navigate("/login");
    }
    setToken(storedToken);
  }, [navigate]);

  const logout = () => {
    clearToken();
    setToken(null);
    navigate("/login");
  };

  return {
    token,
    isAuthenticated: !!token,
    logout,
  };
};