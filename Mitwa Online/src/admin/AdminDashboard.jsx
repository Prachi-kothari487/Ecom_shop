import { useEffect, useState } from "react";
import API from "../utils/api";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

function StatCard({ icon, label, value, color, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-5 shadow-card border-l-4 ${color}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-xs font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-dark">{value}</p>
          {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/api/admin/stats"),
      API.get("/api/orders/online"),
      API.get("/api/products"),
    ]).then(([statsRes, ordersRes, productsRes]) => {
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
      setLowStock(productsRes.data.filter((p) => p.stock <= 3 && p.stock >= 0).slice(0, 5));

      // Build last 7 days chart
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        const dayOrders = ordersRes.data.filter((o) => {
          const od = new Date(o.createdAt);
          return od.toDateString() === d.toDateString();
        });
        const dayRevenue = dayOrders.reduce((s, o) => s + (o.total || 0), 0);
        days.push({ day: label, orders: dayOrders.length, revenue: dayRevenue });
      }
      setChartData(days);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </AdminLayout>
    );
  }

  const quickActions = [
    { to: "/admin/add", label: "Add Product", icon: "➕", color: "bg-pink-gradient" },
    { to: "/admin/orders", label: "Online Orders", icon: "📦", color: "bg-purple-gradient" },
    { to: "/admin/pos", label: "Create Bill", icon: "🧾", color: "bg-gradient-to-r from-green-400 to-emerald-500" },
    { to: "/admin/products", label: "Manage Products", icon: "👗", color: "bg-gradient-to-r from-yellow-400 to-orange-400" },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Admin Dashboard 👑</h1>
        <p className="text-muted text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard icon="💰" label="Total Online Revenue" value={`₹${(stats?.onlineRevenue || 0).toLocaleString()}`} color="border-pink-500" />
        <StatCard icon="🧾" label="Offline Revenue" value={`₹${(stats?.offlineRevenue || 0).toLocaleString()}`} color="border-purple-500" />
        <StatCard icon="📦" label="Online Orders" value={stats?.onlineOrders || 0} color="border-blue-500" />
        <StatCard icon="🛍️" label="Products" value={stats?.products || 0} color="border-yellow-500" />
        <StatCard icon="👥" label="Customers" value={stats?.customers || 0} color="border-green-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {quickActions.map(({ to, label, icon, color }) => (
          <Link
            key={to}
            to={to}
            className={`${color} text-white p-4 rounded-2xl flex items-center gap-3 shadow-card hover:shadow-card-hover hover:scale-105 transition-all`}
          >
            <span className="text-2xl">{icon}</span>
            <span className="font-semibold text-sm">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-bold text-dark mb-4">📈 Online Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => [`₹${val}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#FF4D8D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-bold text-dark mb-4">📦 Orders Per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(val) => [val, "Orders"]} />
              <Line type="monotone" dataKey="orders" stroke="#7C5CFC" strokeWidth={2.5} dot={{ r: 4, fill: "#7C5CFC" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-dark">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-primary hover:underline font-medium">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-muted text-sm text-center py-6">No orders yet 😊</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dark">{o.userId}</p>
                    <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">₹{o.total}</p>
                    <span className={`badge text-xs ${o.status === "delivered" ? "status-delivered" : o.status === "shipped" ? "status-shipped" : "status-pending"}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-dark">⚠️ Low Stock Alert</h3>
            <Link to="/admin/products" className="text-xs text-primary hover:underline font-medium">Manage →</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-2">✅</p>
              <p className="text-sm text-green-600 font-medium">All products well stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {p.image ? (
                      <img src={p.image.startsWith("http") ? p.image : `${import.meta.env.VITE_API_URL}${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                    ) : <span className="flex items-center justify-center h-full text-lg">👗</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{p.name}</p>
                    <p className="text-xs text-muted">₹{p.price}</p>
                  </div>
                  <span className={`badge text-xs font-bold ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                    {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
