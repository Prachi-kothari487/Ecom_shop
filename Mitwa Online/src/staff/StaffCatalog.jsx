import { useEffect, useState } from "react";
import API from "../utils/api";
import AdminLayout from "../admin/AdminLayout";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StaffCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    API.get("/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load catalog"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchGender = !gender || p.gender === gender;
    return matchSearch && matchGender;
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">Product Catalog 👗</h2>
        <p className="text-muted text-sm">{products.length} items in inventory</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Search products..."
          className="input-field flex-1 min-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setGender("")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${!gender ? "bg-hero-gradient text-white" : "bg-gray-100 text-gray-600"}`}
          >All</button>
          <button
            onClick={() => setGender("girls")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${gender === "girls" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600"}`}
          >👧 Girls</button>
          <button
            onClick={() => setGender("boys")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${gender === "boys" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
          >👦 Boys</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-muted">
          <div className="text-5xl mb-2">👗</div>
          No products match your filter
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const imgSrc = p.image?.startsWith("http") ? p.image : `${API_URL}${p.image}`;
            return (
              <div key={p._id} className="bg-white p-3 rounded-2xl shadow-card hover:shadow-card-hover transition-all">
                <img src={imgSrc} alt={p.name} className="h-40 w-full object-cover rounded-xl mb-2" />
                <h3 className="font-semibold text-dark text-sm truncate">{p.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-primary font-bold">₹{p.price}</p>
                  <span className={`badge text-xs ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {p.stock} in stock
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
