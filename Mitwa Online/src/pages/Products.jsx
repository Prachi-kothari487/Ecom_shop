import { useState, useEffect, useCallback } from "react";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-8 w-full mt-3" />
      </div>
    </div>
  );
}

const AGE_RANGES = [
  { label: "All Ages", min: null, max: null },
  { label: "0–2 yrs", min: 0, max: 2 },
  { label: "2–5 yrs", min: 2, max: 5 },
  { label: "5–10 yrs", min: 5, max: 10 },
  { label: "10+ yrs", min: 10, max: 16 },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState(0); // index into AGE_RANGES
  const [sort, setSort] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) setCategory(catParam);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get("/api/products"),
      API.get("/api/categories"),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data);
      setCategories(catRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const ageFilter = AGE_RANGES[ageRange];

  const filteredProducts = products
    .filter((p) => {
      if (debouncedSearch && !p.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (category && p.category !== category) return false;
      if (gender && p.gender !== gender) return false;
      if (inStockOnly && p.stock === 0) return false;
      if (ageFilter.min !== null && p.ageMax !== undefined && p.ageMax < ageFilter.min) return false;
      if (ageFilter.max !== null && p.ageMin !== undefined && p.ageMin > ageFilter.max) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  const clearFilters = () => {
    setSearch(""); setCategory(""); setGender(""); setAgeRange(0); setSort(""); setInStockOnly(false);
  };

  const hasFilters = search || category || gender || ageRange !== 0 || sort || inStockOnly;

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Banner */}
      <div className="bg-hero-gradient py-12 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          Our Collection 👗
        </motion.h1>
        <p className="text-white/80 text-sm">Premium kids fashion from Udaipur</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Search products..."
              className="input-field pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3">
            {/* Category */}
            <select
              className="input-field flex-1 min-w-36"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Gender */}
            <select
              className="input-field flex-1 min-w-36"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="girls">👧 Girls</option>
              <option value="boys">👦 Boys</option>
            </select>

            {/* Sort */}
            <select
              className="input-field flex-1 min-w-36"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="low">Price: Low to High 💰</option>
              <option value="high">Price: High to Low 💎</option>
            </select>
          </div>

          {/* Age Range + In-Stock + Clear */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map((range, i) => (
                <button
                  key={i}
                  onClick={() => setAgeRange(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    ageRange === i
                      ? "bg-hero-gradient text-white shadow-glow"
                      : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-primary"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <div
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${inStockOnly ? "bg-primary" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">In Stock Only</span>
            </label>

            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-primary hover:underline font-medium">
                Clear All ✕
              </button>
            )}
          </div>
        </div>

        {/* Result count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted font-medium">
            {loading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-muted text-sm mb-6">Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
