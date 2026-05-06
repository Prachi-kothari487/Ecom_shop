import { Link } from "react-router-dom";

export default function StaffDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-56 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Staff Panel 👨‍💼</h2>
        <div className="flex flex-col gap-4">
          <Link to="/staff/orders">📦 Online Orders</Link>
          <Link to="/staff/offline">🧾 Offline Bills</Link>
          <Link to="/admin/pos">💻 POS Billing</Link>
          <Link to="/staff/catalog">👗 View Catalog</Link>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome 👋</h1>
        <p className="text-gray-500">Select option from left panel</p>
      </div>

    </div>
  );
}
