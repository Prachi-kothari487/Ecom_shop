import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import VideoHero from "../components/VideoHero";
import CouponPopup from "../components/CouponPopup";
import useTheme from "../hooks/useTheme";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", message: "", rating: "" });
  const theme = useTheme();

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data.slice(0, 6)))
      .catch(() => {});
    axios.get("http://localhost:5000/api/reviews")
      .then((res) => setReviews(res.data))
      .catch(() => {});
  }, []);

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.message || !reviewForm.rating) {
      alert("Fill all fields ❌");
      return;
    }
    await axios.post("http://localhost:5000/api/reviews", reviewForm);
    alert("Review added ❤️");
    setReviewForm({ name: "", message: "", rating: "" });
    const res = await axios.get("http://localhost:5000/api/reviews");
    setReviews(res.data);
  };

  const fallbackReviews = [
    { name: "Riya", message: "Amazing quality 😍", rating: 5 },
    { name: "Neha", message: "Loved the designs 👗", rating: 5 },
    { name: "Pooja", message: "Affordable & stylish 💖", rating: 4 }
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  const themeBg = theme === "diwali" ? "bg-yellow-50" : theme === "christmas" ? "bg-red-50" : "bg-white";

  return (
    <div className={themeBg}>

      {/* COUPON POPUP */}
      <CouponPopup />

      {/* VIDEO HERO */}
      <VideoHero />

      {/* CATEGORY */}
      <div className="px-12 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Shop By Category</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {["Boys 👦", "Girls 👧", "New Arrivals ✨", "Toddlers 👶"].map((c, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}
              className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-xl font-semibold shadow cursor-pointer">
              {c}
            </motion.div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="px-12 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-10 text-center">Trending Now 🔥</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {products.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
              <img
                src={p.image?.startsWith("http") ? p.image : `http://localhost:5000/${p.image}`}
                className="h-56 w-full object-cover"
                alt={p.name}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-pink-500 font-bold">₹{p.price}</p>
                <a href="/products" className="mt-3 block w-full bg-black text-white py-2 rounded-full hover:bg-pink-500 transition text-center">
                  View Products 🛍️
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/products" className="text-primary font-semibold text-lg">View All Products →</a>
        </div>
      </div>

      {/* WHY US */}
      <div className="px-12 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose Us 💖</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {["✨ Premium Quality", "💰 Affordable Price", "🚚 Fast Delivery", "📱 WhatsApp Order"].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-gray-50 p-6 rounded-xl shadow text-gray-600">
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      {/* BEFORE AFTER */}
      <div className="px-12 py-20 bg-pink-50">
        <h2 className="text-3xl font-bold text-center mb-10">Style Transformation ✨</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="text-center">
            <p className="mb-2 font-semibold text-gray-500">Before 😐</p>
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552" className="rounded-xl shadow w-full h-64 object-cover" alt="before" />
          </div>
          <div className="text-center">
            <p className="mb-2 font-semibold text-pink-500">After 😍</p>
            <img src="https://images.unsplash.com/photo-1521336575822-6da63fb45455" className="rounded-xl shadow w-full h-64 object-cover" alt="after" />
          </div>
        </div>
      </div>

      {/* INSTAGRAM FEED */}
      <div className="px-12 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Follow Us on Instagram 📸</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            "https://images.unsplash.com/photo-1521336575822-6da63fb45455",
            "https://images.unsplash.com/photo-1519741497674-611481863552",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b"
          ].map((img, i) => (
            <motion.img key={i} src={img} whileHover={{ scale: 1.05 }}
              className="rounded-xl shadow h-48 w-full object-cover cursor-pointer" alt="instagram" />
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="https://instagram.com/mitwacollectionudaipur" target="_blank" rel="noreferrer"
            className="text-pink-500 font-semibold">@mitwacollectionudaipur →</a>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="px-12 py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say 💬</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {displayReviews.map((r, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg">{r.name}</h3>
              <p className="text-gray-600 mt-2">{r.message}</p>
              <p className="mt-2 text-yellow-500">{"⭐".repeat(Number(r.rating))}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 max-w-md mx-auto bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-4">Leave a Review ✍️</h3>
          <input placeholder="Your Name" value={reviewForm.name}
            className="border p-2 w-full mb-2 rounded"
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
          <textarea placeholder="Your Review" value={reviewForm.message}
            className="border p-2 w-full mb-2 rounded"
            onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })} />
          <input placeholder="Rating (1-5)" value={reviewForm.rating} type="number" min="1" max="5"
            className="border p-2 w-full mb-3 rounded"
            onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} />
          <button onClick={submitReview} className="bg-black text-white px-6 py-2 rounded-full w-full hover:bg-pink-500 transition">
            Submit Review
          </button>
        </div>
      </div>

      {/* CONTACT */}
      <div className="px-12 py-20 bg-black text-white text-center space-y-2">
        <h2 className="text-3xl font-bold mb-4">Contact Us 📞</h2>
        <p>📍 Sindhi Bazar, Udaipur</p>
        <p>📱 <a href="https://wa.me/919261151400" className="text-green-400" target="_blank" rel="noreferrer">9261151400</a></p>
        <p>📸 <a href="https://instagram.com/mitwacollectionudaipur" className="text-pink-400" target="_blank" rel="noreferrer">@mitwacollectionudaipur</a></p>
      </div>

      <div className="bg-gray-900 text-gray-400 p-4 text-center text-sm">
        © 2026 MITWA COLLECTION | All Rights Reserved
      </div>

    </div>
  );
}
