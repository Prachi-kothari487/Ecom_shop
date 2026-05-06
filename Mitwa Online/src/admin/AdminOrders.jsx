import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get("http://localhost:5000/api/orders/online").then((res) => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    await axios.put(`http://localhost:5000/api/orders/${id}/deliver`);
    fetchOrders();
  };

  const sendWhatsApp = (order) => {
    if (!order.phone) {
      alert("No phone number for this customer ❌");
      return;
    }
    let message = `🧾 *MITWA COLLECTION*\n\nCustomer: ${order.userId}\n\n`;
    order.items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} x${item.qty || 1} - ₹${item.price * (item.qty || 1)}\n`;
    });
    message += `\nTotal: ₹${order.total}`;
    message += `\n\nThank you 💖`;
    window.open(`https://wa.me/91${order.phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="p-6 bg-bg min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Online Orders 📦</h2>

      {orders.length === 0 && <p className="text-gray-500">No orders yet 😅</p>}

      {orders.map((o, i) => (
        <div key={i} className="bg-white border p-4 mb-3 rounded-xl shadow">
          <p className="font-semibold">👤 {o.userId}</p>
          <p className="text-sm text-gray-500">📱 {o.phone || "No number"}</p>
          {o.items.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600">
              {item.name} x{item.qty || 1} - ₹{item.price * (item.qty || 1)}
            </p>
          ))}
          <p className="font-bold mt-1">Total: ₹{o.total}</p>
          <p className="mt-1">
            Status:{" "}
            <span className={`px-2 py-1 rounded text-sm ${o.status === "delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {o.status}
            </span>
          </p>

          <div className="flex gap-2 mt-2">
            {o.status !== "delivered" && (
              <button
                onClick={() => markDelivered(o._id)}
                className="bg-green-500 text-white px-4 py-1 rounded-full text-sm"
              >
                Mark Delivered ✅
              </button>
            )}
            <button
              onClick={() => sendWhatsApp(o)}
              className="bg-green-600 text-white px-4 py-1 rounded-full text-sm"
            >
              Send WhatsApp 📱
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
