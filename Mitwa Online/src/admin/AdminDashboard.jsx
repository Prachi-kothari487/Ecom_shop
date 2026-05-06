import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-bg min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Panel 👑</h1>
      <div className="flex gap-6">
        <Link to="/admin/add" className="bg-primary text-white px-6 py-3 rounded-xl">
          ➕ Add Product
        </Link>
        <Link to="/admin/orders" className="bg-secondary text-white px-6 py-3 rounded-xl">
          📦 Online Orders
        </Link>
        <Link to="/admin/offline" className="bg-yellow-400 text-white px-6 py-3 rounded-xl">
          🧾 Offline Bills
        </Link>
        <Link to="/admin/pos" className="bg-green-500 text-white px-6 py-3 rounded-xl">
          🧾 Create Bill
        </Link>
        <Link to="/admin/staff" className="bg-purple-500 text-white px-6 py-3 rounded-xl">
          👨‍💼 Add Staff
        </Link>
        <Link to="/admin/products" className="bg-red-400 text-white px-6 py-3 rounded-xl">
          📦 Manage Products
        </Link>
      </div>
    </div>
  );
}
