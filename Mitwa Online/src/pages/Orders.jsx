import { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_CONFIG = {
  pending:    { label: "Pending",    color: "status-pending",    icon: "🕐", step: 0 },
  processing: { label: "Processing", color: "status-processing", icon: "⚙️", step: 1 },
  shipped:    { label: "Shipped",    color: "status-shipped",    icon: "🚚", step: 2 },
  delivered:  { label: "Delivered",  color: "status-delivered",  icon: "✅", step: 3 },
};

const STEPS = ["Ordered", "Processing", "Shipped", "Delivered"];

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    API.get("/api/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-dark mb-2">Login to view your orders</h2>
          <p className="text-muted text-sm mb-6">See all your past orders and their status</p>
          <Link to="/login?redirect=orders" className="btn-primary px-8 py-3">Login Now</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="skeleton h-8 w-48 mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 space-y-3">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6">
          My Orders 📦
          <span className="text-sm font-normal text-muted ml-2">({orders.length} orders)</span>
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-card">
            <div className="text-7xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-muted text-sm mb-6">Start shopping and your orders will appear here!</p>
            <Link to="/products" className="btn-primary px-8 py-3">Shop Now 🛍️</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const step = statusCfg.step;
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl shadow-card overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between px-5 pt-5 pb-3 gap-2">
                    <div>
                      <p className="text-xs text-muted">Order ID</p>
                      <p className="font-bold text-dark text-sm"># {String(order._id).slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <p className="font-bold text-primary text-lg">₹{order.total}</p>
                    </div>
                    <span className={`badge ${statusCfg.color}`}>
                      {statusCfg.icon} {statusCfg.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-5 py-3 bg-gray-50">
                    <div className="flex items-center gap-0">
                      {STEPS.map((s, idx) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                            idx <= step ? "bg-primary text-white shadow-glow" : "bg-gray-200 text-muted"
                          }`}>
                            {idx < step ? "✓" : idx + 1}
                          </div>
                          {idx < STEPS.length - 1 && (
                            <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${idx < step ? "bg-primary" : "bg-gray-200"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      {STEPS.map((s, idx) => (
                        <p key={s} className={`text-xs ${idx === 0 ? "text-left" : idx === STEPS.length - 1 ? "text-right" : "text-center flex-1"} ${idx <= step ? "text-primary font-medium" : "text-muted"}`}>
                          {s}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-3 border-t border-gray-50">
                    {order.items.map((item, j) => {
                      const imgSrc = item.image?.startsWith("http") ? item.image : item.image ? `${API_URL}${item.image}` : null;
                      return (
                        <div key={j} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                          {imgSrc ? (
                            <img src={imgSrc} alt={item.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">👗</div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-800">{item.name}</p>
                            <p className="text-xs text-muted">Qty: {item.qty || 1}</p>
                          </div>
                          <p className="font-semibold text-sm text-primary">₹{item.price * (item.qty || 1)}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Address */}
                  {order.address && (
                    <div className="px-5 py-3 bg-blue-50 flex items-start gap-2 text-sm border-t border-blue-100">
                      <span>📍</span>
                      <p className="text-blue-700 text-xs">{order.address.street}, {order.address.city} - {order.address.pincode}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="px-5 py-4 flex items-center justify-between border-t border-gray-50">
                    <Link to="/products" className="text-sm text-secondary font-semibold hover:underline">
                      Reorder 🔄
                    </Link>
                    <p className="text-xs text-muted">
                      {order.coupon && <span className="badge status-delivered mr-2">🎟️ {order.coupon}</span>}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
