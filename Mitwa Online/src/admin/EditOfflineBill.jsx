import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function EditOfflineBill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    API.get(`/api/offline-bills/${id}`).then((res) => setBill(res.data));
  }, [id]);

  const updateQty = (index, change) => {
    const updated = { ...bill, items: [...bill.items] };
    const newQty = updated.items[index].qty + change;
    if (newQty <= 0) {
      updated.items.splice(index, 1);
    } else {
      updated.items[index] = {
        ...updated.items[index],
        qty: newQty,
        total: updated.items[index].price * newQty
      };
    }
    updated.subtotal = updated.items.reduce((s, i) => s + i.total, 0);
    updated.total = updated.subtotal;
    setBill(updated);
  };

  const saveChanges = async () => {
    await API.put(`/api/offline-bills/${id}`, bill);
    alert("Bill Updated ✅");
    navigate("/admin/offline");
  };

  const sendWhatsApp = () => {
    if (!bill.phone) { alert("No phone number ❌"); return; }
    let text = `🧾 *MITWA COLLECTION*\n\nBill No: ${bill.billNumber}\nCustomer: ${bill.customerName}\n\n`;
    bill.items.forEach((i) => { text += `${i.name} x${i.qty} = ₹${i.total}\n`; });
    text += `\nTotal: ₹${bill.total}\n\nThank you ❤️`;
    window.open(`https://wa.me/91${bill.phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (!bill) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow mt-6">
      <h2 className="text-2xl font-bold mb-1">Edit Bill 🧾</h2>
      <p className="text-gray-500 mb-1">{bill.billNumber}</p>
      <p className="text-gray-500 mb-4">Customer: {bill.customerName} | 📱 {bill.phone}</p>

      {bill.items.map((item, i) => (
        <div key={i} className="flex justify-between items-center border-b py-2">
          <span className="flex-1 text-sm">{item.name}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => updateQty(i, -1)} className="bg-gray-200 px-2 rounded">➖</button>
            <span className="font-bold w-6 text-center">{item.qty}</span>
            <button onClick={() => updateQty(i, 1)} className="bg-gray-200 px-2 rounded">➕</button>
          </div>
          <span className="ml-4 font-semibold text-sm">₹{item.total}</span>
        </div>
      ))}

      <h3 className="mt-4 font-bold text-lg">Total: ₹{bill.total}</h3>

      <div className="flex gap-2 mt-4">
        <button onClick={saveChanges} className="flex-1 bg-green-500 text-white py-2 rounded-full">
          Save 💾
        </button>
        <button onClick={sendWhatsApp} className="flex-1 bg-green-600 text-white py-2 rounded-full">
          WhatsApp 📱
        </button>
      </div>
    </div>
  );
}
