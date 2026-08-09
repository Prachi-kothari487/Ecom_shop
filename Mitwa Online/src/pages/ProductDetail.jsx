import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    Promise.all([
      API.get(`/api/products/${id}`),
      API.get("/api/products"),
    ]).then(([res, allRes]) => {
      setProduct(res.data);
      setRelated(
        allRes.data.filter((p) => p._id !== id && p.category === res.data.category).slice(0, 4)
      );
    }).catch(() => {
      toast.error("Product not found");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock === 0) { toast.error("Out of stock"); return; }
    addToCart(product);
    setAddedAnimation(true);
    toast.success(`${product.name} added to cart! 🛒`);
    setTimeout(() => setAddedAnimation(false), 600);
  };

  const handleWhatsApp = () => {
    const msg = `Hi! I'm interested in: ${product.name} (₹${product.price})\n\nFrom MITWA Collection website 💖`;
    window.open(`https://wa.me/919261151400?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="skeleton h-96 rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-1/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Product not found</h2>
        <Link to="/products" className="btn-primary mt-4">Browse Products</Link>
      </div>
    );
  }

  const imgSrc = product.image?.startsWith("http") ? product.image : `${API_URL}${product.image}`;

  return (
    <div className="min-h-screen bg-bg">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
          <span>›</span>
          <span className="text-dark font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden bg-white shadow-card-hover">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-80 md:h-[480px] object-cover"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.stock === 0 && (
                <span className="badge bg-gray-700 text-white">Out of Stock</span>
              )}
              {product.stock > 0 && product.stock <= 3 && (
                <span className="badge bg-orange-500 text-white">🔥 Only {product.stock} left!</span>
              )}
              {product.gender && (
                <span className={`badge ${product.gender === "girls" ? "bg-pink-500 text-white" : "bg-blue-500 text-white"}`}>
                  {product.gender === "girls" ? "👧 Girls" : "👦 Boys"}
                </span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-start"
          >
            {product.category && (
              <span className="text-sm text-secondary font-semibold bg-purple-50 px-3 py-1 rounded-full inline-block mb-3 w-fit">
                {product.category}
              </span>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-dark leading-tight mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              {(product.ageMin || product.ageMax) && (
                <span className="text-sm text-muted bg-gray-100 px-3 py-1 rounded-full">
                  👶 Age {product.ageMin || 0}–{product.ageMax || 12} yrs
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-surface rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Size Guide */}
            <div className="bg-pink-50 rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">📏 Size & Care</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Designed for ages {product.ageMin || 0}–{product.ageMax || 12} years.
                Machine washable. Soft, breathable fabric for all-day comfort.
                {product.gender === "girls" ? " 🎀 Perfect for girls!" : product.gender === "boys" ? " ⚡ Perfect for boys!" : ""}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                  product.stock === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : addedAnimation
                    ? "bg-green-500 text-white scale-95 shadow-glow"
                    : "bg-hero-gradient text-white hover:shadow-glow hover:scale-105"
                }`}
              >
                {addedAnimation ? "Added! ✅" : "Add to Cart 🛒"}
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex-1 py-4 rounded-2xl font-bold text-base bg-green-500 text-white hover:bg-green-600 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order on WhatsApp
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: "🚚", text: "Fast Delivery" },
                { icon: "💯", text: "Premium Quality" },
                { icon: "🔄", text: "Easy Returns" },
              ].map((item) => (
                <div key={item.text} className="bg-surface rounded-xl py-2 px-1">
                  <div className="text-lg">{item.icon}</div>
                  <p className="text-xs text-muted font-medium mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-dark mb-6">You May Also Like 💕</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
