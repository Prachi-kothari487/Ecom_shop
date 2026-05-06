import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || p.category === category)
  );

  return (
    <div className="bg-bg min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Collection 👗</h2>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search products 🔍"
          className="border p-2 rounded-lg flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded-lg"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Girls Wear">Girls Wear</option>
          <option value="Boys Wear">Boys Wear</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p, i) => <ProductCard key={i} product={p} />)
        ) : (
          <p className="text-gray-500 col-span-4 text-center">No products found 😅</p>
        )}
      </div>
    </div>
  );
}
