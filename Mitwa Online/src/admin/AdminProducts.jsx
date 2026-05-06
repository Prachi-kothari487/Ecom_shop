import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => setProducts(res.data));
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="p-6 bg-bg min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Manage Products 📦</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-3 rounded-xl shadow">
            <img
              src={p.image?.startsWith("http") ? p.image : `http://localhost:5000/${p.image}`}
              className="h-32 w-full object-cover rounded"
              alt={p.name}
            />
            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p className="text-primary font-bold">₹{p.price}</p>
            <p className="text-sm text-gray-500">Type: {p.gender || "—"}</p>
            <p className="text-sm text-gray-500">Stock: {p.stock ?? "—"}</p>
            <button
              onClick={() => deleteProduct(p._id)}
              className="bg-red-500 text-white px-3 py-1 mt-2 rounded-full w-full text-sm"
            >
              Delete ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
