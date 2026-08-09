import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function VideoHero() {
  return (
    <div className="relative py-16 md:py-24 px-6 md:px-12 bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden border-b border-pink-100/50">
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-pink-100 shadow-card max-w-3xl mx-auto"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-pink-100 text-primary border border-pink-200 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <span>✨</span> New Collection 2026 Live!
          </span>

          {/* Main Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-dark leading-tight mb-4">
            Cute. Comfy. <br className="hidden md:block" />
            <span className="gradient-text">
              Stylish. 👶✨
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Handcrafted & curated fashion for your little stars. Soft fabrics, vibrant colors, and unforgettable styles from Udaipur.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="btn-primary py-3.5 px-8 text-base shadow-glow hover:scale-105 transition-all flex items-center gap-2"
            >
              Shop Collection 🛍️
            </Link>
            <a
              href="https://wa.me/919261151400?text=Hello%20I%20want%20to%20know%20about%20kids%20collection"
              target="_blank"
              rel="noreferrer"
              className="py-3.5 px-6 rounded-full bg-pink-50 hover:bg-pink-100 text-primary font-semibold text-sm border border-pink-200 transition-all flex items-center gap-2"
            >
              Order on WhatsApp 📱
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-primary font-bold text-lg md:text-xl">500+</p>
              <p className="text-muted text-xs">Happy Kids</p>
            </div>
            <div>
              <p className="text-primary font-bold text-lg md:text-xl">100%</p>
              <p className="text-muted text-xs">Soft Fabric</p>
            </div>
            <div>
              <p className="text-primary font-bold text-lg md:text-xl">Udaipur</p>
              <p className="text-muted text-xs">Local Store</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
