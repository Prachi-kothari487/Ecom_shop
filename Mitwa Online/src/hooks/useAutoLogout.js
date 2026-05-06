import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAutoLogout() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) return;

    try {
      const decoded = jwtDecode(user.token);
      const expiry = decoded.exp * 1000;
      const now = Date.now();

      if (expiry < now) {
        logout();
        return;
      }

      const timer = setTimeout(logout, expiry - now);
      return () => clearTimeout(timer);
    } catch {
      logout();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
}
