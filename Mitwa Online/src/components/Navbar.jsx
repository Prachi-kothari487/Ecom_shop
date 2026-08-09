import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative font-medium text-sm transition-colors duration-200 pb-1 ${
        isActive(to)
          ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
          : "text-gray-600 hover:text-primary"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-nav py-2" : "bg-white py-3"
        } px-6 md:px-10`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-hero-gradient rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <span className="text-xl font-bold gradient-text">MITWA</span>
              <p className="text-xs text-muted leading-none hidden sm:block">Kids Collection</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Shop</NavLink>
            {!isAdmin && !isStaff && <NavLink to="/orders">My Orders</NavLink>}
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            {isStaff && <NavLink to="/staff">Staff</NavLink>}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart (customers only) */}
            {!isAdmin && !isStaff && (
              <Link
                to="/cart"
                className="relative p-2 rounded-xl hover:bg-pink-50 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce-in">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User */}
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors px-3 py-1.5">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 bg-hero-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-24 truncate">
                    {user.name}
                  </span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-glass border border-pink-50 animate-fade-in overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100">
                      <p className="font-semibold text-sm text-dark">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                      <span className="badge mt-1 bg-pink-100 text-primary capitalize">{user.role}</span>
                    </div>
                    <div className="p-2">
                      {!isAdmin && !isStaff && (
                        <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 rounded-xl transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          My Orders
                        </Link>
                      )}
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 rounded-xl transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-glass animate-slide-in flex flex-col">
            {/* Header */}
            <div className="p-6 bg-hero-gradient">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">MITWA</p>
                  <p className="text-white/80 text-xs">Kids Collection, Udaipur</p>
                </div>
              </div>
              {user && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-white/70 text-xs capitalize">{user.role}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <nav className="flex-1 p-4 space-y-1">
              {[
                { to: "/", label: "🏠 Home" },
                { to: "/products", label: "🛍️ Shop" },
                ...(!isAdmin && !isStaff ? [
                  { to: "/cart", label: `🛒 Cart ${cartCount > 0 ? `(${cartCount})` : ""}` },
                  { to: "/orders", label: "📦 My Orders" },
                ] : []),
                ...(isAdmin ? [
                  { to: "/admin", label: "👑 Admin Panel" },
                  { to: "/admin/orders", label: "📦 Online Orders" },
                  { to: "/admin/pos", label: "🧾 Create Bill" },
                  { to: "/admin/offline", label: "📋 Offline Bills" },
                  { to: "/admin/products", label: "🗂️ Products" },
                  { to: "/admin/add", label: "➕ Add Product" },
                  { to: "/admin/staff", label: "👨‍💼 Staff" },
                ] : []),
                ...(isStaff ? [{ to: "/staff", label: "👨‍💼 Staff Panel" }] : []),
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`block px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                    isActive(to) ? "bg-pink-50 text-primary" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="btn-primary text-center text-sm py-2.5">Login</Link>
                  <Link to="/register" className="text-center text-sm text-primary font-medium py-2">Register</Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
