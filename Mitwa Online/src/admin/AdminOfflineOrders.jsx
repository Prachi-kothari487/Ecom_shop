import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AdminOfflineOrders() {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/offline-bills")
      .then((res) => setBills(res.data))
      .catch((err) => console.error(err));
  }, []);

  const sendWhatsApp = (bill) => {
    if (!bill.phone) { alert("No phone number ❌"); return; }
    let text = `🧾 *MITWA COLLECTION*\n\nBill No: ${bill.billNumber}\nCustomer: ${bill.customerName}\n\n`;
    bill.items.forEach((i) => { text += `${i.name} x${i.qty} = ₹${i.total}\n`; });
    text += `\nTotal: ₹${bill.total}\n\nThank you ❤️`;
    window.open(`https://wa.me/91${bill.phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="p-6 bg-bg min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Offline Bills 🧾</h2>

      {bills.length === 0 && <p className="text-gray-500">No bills yet 😅</p>}

      {bills.map((bill, i) => (
        <div key={i} className="bg-white p-4 mb-3 rounded-xl shadow">
          <p className="font-semibold">{bill.billNumber}</p>
          <p>Customer: {bill.customerName}</p>
          <p className="text-sm text-gray-500">📱 {bill.phone}</p>
          {bill.items.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600">{item.name} x{item.qty} = ₹{item.total}</p>
          ))}
          <p className="font-bold mt-1">Total: ₹{bill.total}</p>
          <p className="text-xs text-gray-400">{new Date(bill.createdAt).toLocaleString()}</p>

          <div className="flex gap-2 mt-2">
            <button onClick={() => sendWhatsApp(bill)}
              className="bg-green-500 text-white px-4 py-1 rounded-full text-sm">
              WhatsApp 📱
            </button>
            <button onClick={() => navigate(`/admin/offline/${bill._id}`)}
              className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
              Edit ✏️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
