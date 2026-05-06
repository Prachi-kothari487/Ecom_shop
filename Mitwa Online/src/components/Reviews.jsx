import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const fallback = [
  { name: "Riya", message: "Amazing quality 😍", rating: 5 },
  { name: "Neha", message: "Loved the designs 👗", rating: 5 },
  { name: "Pooja", message: "Affordable & stylish 💖", rating: 4 }
];

export default function Reviews() {
  const [reviews, setReviews] = useState(fallback);

  useEffect(() => {
    axios.get("http://localhost:5000/api/reviews")
      .then((res) => { if (res.data.length > 0) setReviews(res.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Customer Reviews ⭐</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-4 bg-white border rounded-xl shadow"
          >
            <h3 className="font-bold">{r.name}</h3>
            <p className="text-gray-600 mt-1">{r.message}</p>
            <p className="text-yellow-500 mt-1">{"⭐".repeat(r.rating)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
