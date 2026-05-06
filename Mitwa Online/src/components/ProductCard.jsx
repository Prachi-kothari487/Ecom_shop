import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4">
      <div className="relative">
        <img
          src={product.image?.startsWith("http") ? product.image : `http://localhost:5000/${product.image}`}
          alt={product.name}
          className="h-40 w-full object-cover rounded-xl"
        />
        {product.stock <= 2 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs px-2 py-1 rounded-full">
            Only {product.stock} left 🔥
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-primary font-bold">₹{product.price}</p>

      <button
        onClick={() => !outOfStock && addToCart(product)}
        disabled={outOfStock}
        className={`mt-3 w-full py-2 rounded-full transition ${
          outOfStock
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-secondary text-white hover:scale-105"
        }`}
      >
        {outOfStock ? "Out of Stock ❌" : "Add to Cart 🛒"}
      </button>
    </div>
  );
}
