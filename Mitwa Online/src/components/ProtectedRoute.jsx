import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const roles = allowedRoles || (role ? [role] : null);

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
