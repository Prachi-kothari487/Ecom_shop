import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6 bg-bg min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Orders 📦</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet 😅</p>
      ) : (
        orders.map((o, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow mb-3">
            <p className="font-semibold">Order #{i + 1}</p>
            {o.items.map((item, j) => (
              <p key={j} className="text-sm text-gray-600">{item.name} - ₹{item.price}</p>
            ))}
            <p className="font-bold mt-1">Total: ₹{o.total}</p>
            <p className="text-sm text-green-600">Status: {o.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
