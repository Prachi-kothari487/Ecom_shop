import { Link } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import { useAuth } from "../context/AuthContext";

export default function StaffDashboard() {
  const { user } = useAuth();

  const actions = [
    { to: "/admin/pos", label: "Create Bill (POS)", icon: "🖥️", color: "bg-pink-gradient", desc: "Generate offline store bill" },
    { to: "/staff/orders", label: "Online Orders", icon: "📦", color: "bg-purple-gradient", desc: "View and process customer orders" },
    { to: "/staff/offline", label: "Offline Bills", icon: "🧾", color: "bg-gradient-to-r from-green-400 to-emerald-500", desc: "View store sales history" },
    { to: "/staff/catalog", label: "Product Catalog", icon: "👗", color: "bg-gradient-to-r from-yellow-400 to-orange-400", desc: "Browse stock & inventory" },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Staff Panel 👋</h1>
        <p className="text-muted text-sm">Welcome back, {user?.name || "Staff"}! Select an option below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map(({ to, label, icon, color, desc }) => (
          <Link
            key={to}
            to={to}
            className={`${color} text-white p-6 rounded-2xl shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all flex items-center gap-4`}
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{label}</h3>
              <p className="text-white/80 text-xs mt-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
