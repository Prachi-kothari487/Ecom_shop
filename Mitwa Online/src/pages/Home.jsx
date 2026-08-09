import { useEffect, useState, useRef } from "react";
import API from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import CouponPopup from "../components/CouponPopup";
import VideoHero from "../components/VideoHero";
import useTheme from "../hooks/useTheme";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { label: "Boys", emoji: "👦", color: "from-blue-400 to-cyan-400", query: "boys" },
  { label: "Girls", emoji: "👧", color: "from-pink-400 to-rose-400", query: "girls" },
  { label: "New Arrivals", emoji: "✨", color: "from-purple-400 to-violet-500", query: "" },
  { label: "Toddlers", emoji: "👶", color: "from-yellow-400 to-orange-400", query: "" },
];

const WHY_US = [
  { icon: "✨", title: "Premium Quality", desc: "Soft, durable fabrics for little ones" },
  { icon: "💰", title: "Affordable Price", desc: "Best fashion at the best price" },
  { icon: "🚚", title: "Fast Delivery", desc: "Same-day dispatch from Udaipur" },
  { icon: "📱", title: "WhatsApp Order", desc: "Order directly via WhatsApp" },
];

const INSTAGRAM_IMGS = [
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1471286174890-9c112ac6a02f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=400&fit=crop",
];

function ReviewCarousel({ reviews }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length);
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, [reviews.length]);

  if (!reviews.length) return null;

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-card text-center max-w-md mx-auto"
        >
          <div className="text-yellow-400 text-2xl mb-3">{"⭐".repeat(Number(reviews[current].rating))}</div>
          <p className="text-gray-600 italic mb-4">"{reviews[current].message}"</p>
          <p className="font-bold text-dark">— {reviews[current].name}</p>
        </motion.div>
      </AnimatePresence>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", message: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    API.get("/api/products").then((res) => setProducts(res.data.slice(0, 6))).catch(() => {});
    API.get("/api/reviews").then((res) => setReviews(res.data)).catch(() => {});
  }, []);

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.message) {
      return;
    }
    setSubmitting(true);
    try {
      await API.post("/api/reviews", reviewForm);
      setReviewForm({ name: "", message: "", rating: 5 });
      const res = await API.get("/api/reviews");
      setReviews(res.data);
    } catch {}
    setSubmitting(false);
  };

  const fallbackReviews = [
    { name: "Riya Sharma", message: "Amazing quality! My daughter absolutely loves her new dress 😍", rating: 5 },
    { name: "Neha Patel", message: "Loved the designs, very affordable and cute! 👗", rating: 5 },
    { name: "Pooja Jain", message: "Stylish collection, fast delivery. Will order again! 💖", rating: 4 },
    { name: "Sunita Verma", message: "Best kids store in Udaipur! Great fabric quality 🌟", rating: 5 },
  ];
  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  const themeBg = theme === "diwali" ? "bg-yellow-50" : theme === "christmas" ? "bg-red-50" : "bg-bg";

  return (
    <div className={themeBg}>
      <CouponPopup />

      {/* VIDEO HERO */}
      <VideoHero />

      {/* SHOP BY CATEGORY */}
      <section className="px-4 md:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">Shop By Category</h2>
            <p className="text-muted">Find the perfect outfit for your little one</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={cat.query ? `/products?category=${cat.query}` : "/products"}
                  className={`block bg-gradient-to-br ${cat.color} rounded-2xl h-36 flex flex-col items-center justify-center text-white shadow-card hover:shadow-card-hover hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  <span className="text-5xl mb-2">{cat.emoji}</span>
                  <span className="font-bold text-base">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="px-4 md:px-12 py-16 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark">Trending Now 🔥</h2>
              <p className="text-muted mt-1">Our most loved pieces this season</p>
            </div>
            <Link to="/products" className="text-primary font-semibold text-sm hover:underline hidden md:block">
              View All →
            </Link>
          </motion.div>
          {products.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-72 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link to="/products" className="btn-primary px-8 py-3">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-4 md:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">Why Choose MITWA? 💖</h2>
            <p className="text-muted">Trusted by thousands of parents in Udaipur</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {WHY_US.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-card text-center hover:shadow-card-hover transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-dark mb-1">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section className="px-4 md:px-12 py-16 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">Follow Us 📸</h2>
            <a href="https://instagram.com/mitwacollectionudaipur" target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline">
              @mitwacollectionudaipur
            </a>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {INSTAGRAM_IMGS.map((img, i) => (
              <motion.a
                key={i}
                href="https://instagram.com/mitwacollectionudaipur"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative overflow-hidden rounded-2xl group"
              >
                <img src={img} alt="instagram" className="h-40 md:h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    📸 View
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="px-4 md:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">What Customers Say 💬</h2>
            <p className="text-muted">Real reviews from happy parents</p>
          </motion.div>

          {/* Auto-scroll carousel */}
          <ReviewCarousel reviews={displayReviews} />

          {/* Review Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-white rounded-2xl shadow-card p-6 max-w-lg mx-auto"
          >
            <h3 className="font-bold text-dark text-lg mb-4">Leave a Review ✍️</h3>
            <div className="space-y-3">
              <input
                placeholder="Your Name"
                value={reviewForm.name}
                className="input-field"
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
              />
              <textarea
                placeholder="Share your experience..."
                value={reviewForm.message}
                className="input-field h-24 resize-none"
                onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })}
              />
              {/* Star Rating */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className={`text-2xl transition-transform hover:scale-125 ${star <= reviewForm.rating ? "text-yellow-400" : "text-gray-200"}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <button
                onClick={submitReview}
                disabled={submitting}
                className="btn-primary w-full py-3 font-semibold disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Review 💖"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-dark-gradient text-white px-4 md:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Visit Us 📍</h2>
            <p className="text-white/70">We'd love to see you in store!</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "📍", title: "Address", info: "Sindhi Bazar, Udaipur, Rajasthan" },
              { icon: "📱", title: "WhatsApp", info: "+91 92611 51400", link: "https://wa.me/919261151400" },
              { icon: "📸", title: "Instagram", info: "@mitwacollectionudaipur", link: "https://instagram.com/mitwacollectionudaipur" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors text-sm">{item.info}</a>
                ) : (
                  <p className="text-white/70 text-sm">{item.info}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white px-4 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-hero-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <p className="font-bold text-white">MITWA COLLECTION</p>
                <p className="text-gray-400 text-xs">Kids Fashion • Udaipur, Rajasthan</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/products" className="hover:text-white transition-colors">Shop</Link>
              <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
              <Link to="/orders" className="hover:text-white transition-colors">Orders</Link>
            </div>
            <div className="flex gap-3">
              <a href="https://wa.me/919261151400" target="_blank" rel="noreferrer" className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center hover:bg-green-400 transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="https://instagram.com/mitwacollectionudaipur" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
          <hr className="border-gray-800 my-6" />
          <p className="text-center text-gray-500 text-xs">
            © 2026 MITWA COLLECTION · All Rights Reserved · Made with 💖 in Udaipur
          </p>
        </div>
      </footer>
    </div>
  );
}
