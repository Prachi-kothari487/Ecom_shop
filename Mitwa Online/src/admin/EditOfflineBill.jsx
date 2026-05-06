import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditOfflineBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders/offline").then((res) => {
      const found = res.data.find((o) => o._id === id);
      // ensure each item has qty
      if (found) {
        found.items = found.items.map((item) => ({ ...item, qty: item.qty || 1 }));
        found.total = found.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      }
      setOrder(found);
    });
  }, [id]);

  const updateQty = (index, change) => {
    const updated = { ...order, items: [...order.items] };
    updated.items[index] = { ...updated.items[index], qty: updated.items[index].qty + change };

    if (updated.items[index].qty <= 0) {
      updated.items.splice(index, 1);
    }

    updated.total = updated.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    setOrder(updated);
  };

  const sendWhatsApp = () => {
    const phone = order.phone ? `91${order.phone}` : "919261151400";
    let message = `🧾 *MITWA COLLECTION*\n\n`;
    message += `Customer: ${order.userId}\n\n`;
    order.items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} x${item.qty || 1} - ₹${item.price * (item.qty || 1)}\n`;
    });
    message += `\nTotal: ₹${order.total}`;
    message += `\n\nThank you 💖`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const saveChanges = async () => {
    await axios.put(`http://localhost:5000/api/orders/${id}`, order);
    alert("Bill Updated ✅");
    navigate("/admin/offline");
  };

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow mt-6">
      <h2 className="text-2xl font-bold mb-2">Edit Bill 🧾</h2>
      <p className="text-gray-500 mb-4">Customer: {order.userId}</p>

      {order.items.length === 0 && <p className="text-gray-400">No items</p>}

      {order.items.map((item, i) => (
        <div key={i} className="flex justify-between items-center border-b py-2">
          <span className="flex-1">{item.name}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => updateQty(i, -1)} className="bg-gray-200 px-2 rounded">➖</button>
            <span className="font-bold w-6 text-center">{item.qty}</span>
            <button onClick={() => updateQty(i, 1)} className="bg-gray-200 px-2 rounded">➕</button>
          </div>
          <span className="ml-4 font-semibold">₹{item.price * item.qty}</span>
        </div>
      ))}

      <h3 className="mt-4 font-bold text-lg">Total: ₹{order.total}</h3>

      <button
        onClick={saveChanges}
        className="bg-green-500 text-white px-6 py-2 mt-4 rounded-full w-full"
      >
        Save Changes 💾
      </button>

      <button
        onClick={sendWhatsApp}
        className="bg-green-600 text-white px-6 py-2 mt-2 rounded-full w-full"
      >
        Send on WhatsApp 📱
      </button>
    </div>
  );
}
