import { useEffect, useState } from "react";
import API from "../utils/api";
import AdminLayout from "../admin/AdminLayout";
import toast from "react-hot-toast";

export default function StaffOffline() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/offline-bills")
      .then((res) => setBills(res.data))
      .catch(() => toast.error("Failed to load bills"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">Offline Store Bills 🧾</h2>
        <p className="text-muted text-sm">{bills.length} total bills</p>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-muted">
          <div className="text-5xl mb-2">🧾</div>
          No offline bills yet
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((b) => (
            <div key={b._id} className="bg-white p-5 rounded-2xl shadow-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-dark">👤 {b.customerName || "Walk-in Customer"}</p>
                  <p className="text-xs text-muted">📱 {b.phone} · Bill: {b.billNumber}</p>
                </div>
                <p className="font-bold text-primary text-lg">₹{b.total}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 mb-2">
                {b.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>{item.name} ×{item.qty}</span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted text-right">{new Date(b.createdAt).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
