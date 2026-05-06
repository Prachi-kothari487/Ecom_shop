import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminOfflineOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders/offline").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6 bg-bg min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Offline Bills 🧾</h2>

      {orders.length === 0 && <p className="text-gray-500">No offline bills yet 😅</p>}

      {orders.map((o, i) => (
        <div key={i} className="bg-white p-4 mb-3 rounded-xl shadow">
          <p className="font-semibold">Customer: {o.userId}</p>
          {o.items.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600">
              {item.name} x{item.qty || 1} - ₹{item.price * (item.qty || 1)}
            </p>
          ))}
          <p className="font-bold mt-1">Total: ₹{o.total}</p>
          <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
          <button
            onClick={() => navigate(`/admin/offline/${o._id}`)}
            className="bg-blue-500 text-white px-4 py-1 mt-2 rounded-full text-sm"
          >
            Edit ✏️
          </button>
        </div>
      ))}
    </div>
  );
}
