import { useEffect, useState } from "react";
import API from "../utils/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStock, setEditingStock] = useState({}); // { id: newStock }
  const [editingPrice, setEditingPrice] = useState({}); // { id: newPrice }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    API.get("/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted ✅");
      setConfirmDelete(null);
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const saveStock = async (id) => {
    const newStock = editingStock[id];
    if (newStock === undefined) return;
    try {
      await API.put(`/api/products/${id}`, { stock: Number(newStock) });
      setProducts(products.map((p) => p._id === id ? { ...p, stock: Number(newStock) } : p));
      setEditingStock((prev) => { const n = { ...prev }; delete n[id]; return n; });
      toast.success("Stock updated ✅");
    } catch {
      toast.error("Update failed");
    }
  };

  const savePrice = async (id) => {
    const newPrice = editingPrice[id];
    if (newPrice === undefined) return;
    try {
      await API.put(`/api/products/${id}`, { price: Number(newPrice) });
      setProducts(products.map((p) => p._id === id ? { ...p, price: Number(newPrice) } : p));
      setEditingPrice((prev) => { const n = { ...prev }; delete n[id]; return n; });
      toast.success("Price updated ✅");
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const stockColor = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-600";
    if (stock <= 3) return "bg-orange-100 text-orange-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-dark">Manage Products 👗</h2>
          <p className="text-muted text-sm">{products.length} products total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchProducts} className="btn-secondary text-sm py-2 px-4">🔄 Refresh</button>
          <a href="/admin/add" className="btn-primary text-sm py-2 px-4">➕ Add Product</a>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          placeholder="Search products..."
          className="input-field pl-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-glass animate-fade-up">
            <div className="text-4xl mb-3 text-center">⚠️</div>
            <h3 className="font-bold text-dark text-lg text-center mb-2">Delete Product?</h3>
            <p className="text-muted text-sm text-center mb-5">
              "{confirmDelete.name}" will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-gray-700 font-medium">Cancel</button>
              <button onClick={() => deleteProduct(confirmDelete._id)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table / Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const imgSrc = p.image?.startsWith("http") ? p.image : `${API_URL}${p.image}`;
            const isEditingStock = editingStock[p._id] !== undefined;
            const isEditingPrice = editingPrice[p._id] !== undefined;

            return (
              <div key={p._id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all">
                {/* Image */}
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 right-2 badge text-xs font-bold ${stockColor(p.stock)}`}>
                    {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                  </span>
                  {p.gender && (
                    <span className={`absolute top-2 left-2 badge text-xs ${p.gender === "girls" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                      {p.gender === "girls" ? "👧" : "👦"}
                    </span>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-dark text-sm leading-tight line-clamp-2">{p.name}</h3>

                  {/* Inline Price Edit */}
                  <div className="flex items-center gap-1">
                    {isEditingPrice ? (
                      <>
                        <input
                          type="number"
                          value={editingPrice[p._id]}
                          onChange={(e) => setEditingPrice((prev) => ({ ...prev, [p._id]: e.target.value }))}
                          className="input-field py-1 text-sm w-20"
                          autoFocus
                        />
                        <button onClick={() => savePrice(p._id)} className="text-green-500 hover:text-green-600 text-xs font-bold">✓</button>
                        <button onClick={() => setEditingPrice((prev) => { const n = {...prev}; delete n[p._id]; return n; })} className="text-gray-400 text-xs">✕</button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingPrice((prev) => ({ ...prev, [p._id]: p.price }))}
                        className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                      >
                        ₹{p.price} <span className="text-xs text-muted">✏️</span>
                      </button>
                    )}
                  </div>

                  {/* Inline Stock Edit */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted">Stock:</span>
                    {isEditingStock ? (
                      <>
                        <input
                          type="number"
                          value={editingStock[p._id]}
                          onChange={(e) => setEditingStock((prev) => ({ ...prev, [p._id]: e.target.value }))}
                          className="input-field py-1 text-sm w-16"
                          autoFocus
                          min={0}
                        />
                        <button onClick={() => saveStock(p._id)} className="text-green-500 hover:text-green-600 text-xs font-bold">✓</button>
                        <button onClick={() => setEditingStock((prev) => { const n = {...prev}; delete n[p._id]; return n; })} className="text-gray-400 text-xs">✕</button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingStock((prev) => ({ ...prev, [p._id]: p.stock }))}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full hover:opacity-80 ${stockColor(p.stock)}`}
                      >
                        {p.stock} ✏️
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  {p.category && (
                    <span className="text-xs text-secondary bg-purple-50 px-2 py-0.5 rounded-full inline-block">{p.category}</span>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => setConfirmDelete(p)}
                    className="w-full mt-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
