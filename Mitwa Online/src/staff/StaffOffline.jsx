import { useEffect, useState } from "react";
import axios from "axios";

export default function StaffOffline() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders/offline").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6 bg-bg min-h-screen">
      <h2 className="text-xl font-bold mb-4">Offline Bills 🧾</h2>

      {orders.length === 0 && <p className="text-gray-500">No offline bills yet 😅</p>}

      {orders.map((o, i) => (
        <div key={i} className="bg-white p-3 mb-2 rounded-xl shadow">
          <p className="font-semibold">Customer: {o.userId}</p>
          {o.items.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600">{item.name} - ₹{item.price}</p>
          ))}
          <p className="font-bold mt-1">Total: ₹{o.total}</p>
          <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
