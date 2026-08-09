import { useEffect, useState } from "react";
import API from "../utils/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending: "status-pending",
  processing: "status-processing",
  shipped: "status-shipped",
  delivered: "status-delivered",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    API.get("/api/orders/online")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/orders/${id}`, { status });
      toast.success(`Order marked as ${status} ✅`);
      fetchOrders();
    } catch {
      toast.error("Update failed");
    }
  };

  const sendWhatsApp = (order) => {
    if (!order.phone) { toast.error("No phone number for this customer ❌"); return; }
    let message = `🧾 *MITWA COLLECTION*\n\nCustomer: ${order.userId}\n\n`;
    order.items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} x${item.qty || 1} - ₹${item.price * (item.qty || 1)}\n`;
    });
    message += `\nTotal: ₹${order.total}`;
    if (order.address) message += `\n\n📍 ${order.address.street}, ${order.address.city} - ${order.address.pincode}`;
    message += `\n\nThank you 💖`;
    window.open(`https://wa.me/91${order.phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.userId?.toLowerCase().includes(search.toLowerCase()) || o.phone?.includes(search);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-dark">Online Orders 📦</h2>
          <p className="text-muted text-sm">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders} className="btn-primary py-2 px-4 text-sm">🔄 Refresh</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search by name or phone..."
            className="input-field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between px-5 pt-4 pb-2 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-hero-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {o.userId?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{o.userId}</p>
                    <p className="text-xs text-muted">{o.phone || "No phone"} · {new Date(o.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-lg">₹{o.total}</p>
                  <p className="text-xs text-muted">#{String(o._id).slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-2 bg-gray-50 text-sm text-gray-600">
                {o.items.map((item, idx) => (
                  <span key={idx} className="inline-block mr-2 text-xs bg-white px-2 py-0.5 rounded-full border mb-1">
                    {item.name} ×{item.qty || 1}
                  </span>
                ))}
              </div>

              {/* Address */}
              {o.address && (
                <div className="px-5 py-2 text-xs text-blue-600 bg-blue-50 border-t border-blue-100">
                  📍 {o.address.street}, {o.address.city} - {o.address.pincode}
                </div>
              )}

              {/* Footer */}
              <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-t border-gray-50">
                {/* Status Dropdown */}
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className={`badge cursor-pointer border-0 font-semibold text-xs py-1.5 px-3 rounded-full ${STATUS_COLORS[o.status] || "status-pending"}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize bg-white text-gray-700">{s}</option>
                  ))}
                </select>

                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => sendWhatsApp(o)}
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
