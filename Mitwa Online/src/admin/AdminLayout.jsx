import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { to: "/admin/orders", label: "Online Orders", icon: "📦" },
  { to: "/admin/offline", label: "Offline Bills", icon: "🧾" },
  { to: "/admin/pos", label: "Create Bill (POS)", icon: "🖥️" },
  { to: "/admin/products", label: "Manage Products", icon: "👗" },
  { to: "/admin/add", label: "Add Product", icon: "➕" },
  { to: "/admin/staff", label: "Staff Management", icon: "👨‍💼" },
];

const staffLinks = [
  { to: "/staff", label: "Dashboard", icon: "📊", exact: true },
  { to: "/admin/pos", label: "Create Bill (POS)", icon: "🖥️" },
  { to: "/staff/orders", label: "Online Orders", icon: "📦" },
  { to: "/staff/offline", label: "Offline Bills", icon: "🧾" },
  { to: "/staff/catalog", label: "Product Catalog", icon: "👗" },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isStaff = user?.role === "staff";
  const links = isStaff ? staffLinks : adminLinks;

  const handleLogout = () => { logout(); toast.success("Logged out"); navigate("/login"); };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-dark-gradient text-white sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to={isStaff ? "/staff" : "/admin"} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-gradient rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <p className="font-bold text-white">MITWA</p>
              <p className="text-xs text-white/50">{isStaff ? "Staff Panel" : "Admin Panel"}</p>
            </div>
          </Link>
        </div>

        {/* User */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-gradient rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/50 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, label, icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-pink-gradient text-white shadow-glow"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-sm transition-all">
            🏪 View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-dark-gradient text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-pink-gradient rounded-lg flex items-center justify-center text-xs font-bold">M</div>
            <span className="font-bold text-sm">MITWA {isStaff ? "Staff" : "Admin"}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {links.slice(0, 4).map(({ to, icon }) => (
              <Link key={to} to={to} className={`p-1.5 rounded-lg text-sm ${location.pathname === to ? "bg-primary" : "bg-white/10"}`}>
                {icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
}
