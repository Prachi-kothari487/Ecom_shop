import { useEffect, useState } from "react";
import axios from "axios";

export default function StaffCatalog() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => setProducts(res.data));
  }, []);

  const filtered = products.filter(
    (p) => category === "" || p.category === category
  );

  return (
    <div className="p-6 bg-bg min-h-screen">
      <h2 className="text-xl font-bold mb-4">Product Catalog 👗</h2>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setCategory("")} className="px-4 py-1 bg-gray-200 rounded-full">All</button>
        <button onClick={() => setCategory("Girls Wear")} className="px-4 py-1 bg-pink-200 rounded-full">Girls</button>
        <button onClick={() => setCategory("Boys Wear")} className="px-4 py-1 bg-blue-200 rounded-full">Boys</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <div key={i} className="bg-white p-3 rounded-xl shadow">
            <img
              src={p.image?.startsWith("http") ? p.image : `http://localhost:5000/${p.image}`}
              className="h-32 w-full object-cover rounded"
              alt={p.name}
            />
            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p className="text-primary font-bold">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
