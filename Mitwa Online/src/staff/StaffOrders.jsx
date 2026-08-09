import { useEffect, useState } from "react";
import API from "../utils/api";
import AdminLayout from "../admin/AdminLayout";
import toast from "react-hot-toast";

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/orders/online")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">Online Orders 📦</h2>
        <p className="text-muted text-sm">{orders.length} total orders</p>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-muted">
          <div className="text-5xl mb-2">📭</div>
          No online orders yet
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-white p-5 rounded-2xl shadow-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-dark">👤 {o.userId}</p>
                  <p className="text-xs text-muted">📱 {o.phone || "No phone"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-lg">₹{o.total}</p>
                  <span className="badge status-pending text-xs capitalize">{o.status}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 mb-2">
                {o.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>{item.name} ×{item.qty || 1}</span>
                    <span>₹{item.price * (item.qty || 1)}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted text-right">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
