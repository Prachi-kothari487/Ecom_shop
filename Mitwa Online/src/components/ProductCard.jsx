import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  const imgSrc = product.image?.startsWith("http")
    ? product.image
    : `${API_URL}${product.image}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {lowStock && (
            <span className="badge bg-orange-100 text-orange-600 text-xs">
              🔥 Only {product.stock} left!
            </span>
          )}
          {outOfStock && (
            <span className="badge bg-gray-200 text-gray-600 text-xs">
              Out of Stock
            </span>
          )}
        </div>
        {/* Gender badge */}
        {product.gender && (
          <span className={`absolute top-2 right-2 badge text-xs ${
            product.gender === "girls" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"
          }`}>
            {product.gender === "girls" ? "👧 Girls" : "👦 Boys"}
          </span>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-full">View Details →</span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Age range */}
        {(product.ageMin || product.ageMax) && (
          <p className="text-xs text-muted mt-1">
            👶 Age: {product.ageMin || 0}–{product.ageMax || 12} yrs
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <p className="text-primary font-bold text-lg">₹{product.price}</p>
          {product.category && (
            <span className="text-xs text-secondary bg-purple-50 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        <button
          onClick={() => !outOfStock && addToCart(product)}
          disabled={outOfStock}
          className={`mt-3 w-full py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
            outOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-hero-gradient text-white hover:shadow-glow hover:scale-105"
          }`}
        >
          {outOfStock ? "Out of Stock ❌" : "Add to Cart 🛒"}
        </button>
      </div>
    </motion.div>
  );
}
