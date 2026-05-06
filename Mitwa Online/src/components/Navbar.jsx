import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">MITWA 💖</h1>

      <div className="flex gap-6 items-center font-medium">
        <Link to="/">Home</Link>
        <Link to="/products">Shop</Link>
        <Link to="/cart">Cart 🛒</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="bg-pink-100 px-3 py-1 rounded-full">
              👤 {user.name}
            </span>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            {user.role === "admin" && <Link to="/admin/orders">Orders</Link>}
            {user.role === "staff" && <Link to="/staff">Staff</Link>}
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-1 rounded-full"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
