import { useState } from "react";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { COUPONS } from "../data/coupons";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [step, setStep] = useState("cart"); // cart | address | success
  const [orderId, setOrderId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [requestId, setRequestId] = useState(() => Date.now().toString(36) + Math.random().toString(36).substring(2));
  const [address, setAddress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mitwa_address")) || { name: "", street: "", city: "", pincode: "", phone: "" }; }
    catch { return { name: "", street: "", city: "", pincode: "", phone: "" }; }
  });

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0;
  const total = subtotal - discountAmount;

  const applyCoupon = () => {
    const found = COUPONS.find((c) => c.code === couponCode.trim().toUpperCase());
    if (!found) { setCouponError("Invalid coupon code ❌"); return; }
    if (new Date() > new Date(found.expiry)) { setCouponError("Coupon expired ⏳"); return; }
    if (subtotal < found.minOrder) { setCouponError(`Minimum order ₹${found.minOrder} required`); return; }
    if (localStorage.getItem(found.code)) { setCouponError("Coupon already used ❌"); return; }
    setAppliedCoupon(found);
    setCouponError("");
    toast.success(`Coupon applied! ${found.discount}% OFF 🎉`);
  };

  const handleProceedToAddress = () => {
    if (!user) {
      toast.error("Please login to continue 🔐");
      navigate("/login?redirect=cart");
      return;
    }
    setStep("address");
  };

  const handlePlaceOrder = async () => {
    if (!address.name || !address.street || !address.city || !address.pincode || !address.phone) {
      toast.error("Please fill all address fields");
      return;
    }
    if (address.phone.length !== 10) { toast.error("Enter valid 10-digit phone number"); return; }

    localStorage.setItem("mitwa_address", JSON.stringify(address));
    setIsPlacingOrder(true);

    try {
      const res = await API.post("/api/orders", {
        userId: user.name || user.email,
        phone: address.phone,
        items: cart,
        total,
        type: "online",
        address: { street: address.street, city: address.city, pincode: address.pincode },
        coupon: appliedCoupon?.code || null,
        requestId: requestId,
      });
      if (appliedCoupon) localStorage.setItem(appliedCoupon.code, "used");
      setOrderId(res.data._id || "ORD" + Date.now());
      setStep("success");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Order failed ❌");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleWhatsApp = () => {
    if (!user) { toast.error("Please login first"); navigate("/login?redirect=cart"); return; }
    let message = `🧾 *MITWA COLLECTION*\n\nOrder Details:\n\n`;
    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;
    });
    message += `\nSubtotal: ₹${subtotal}`;
    if (appliedCoupon) {
      message += `\nCoupon: ${appliedCoupon.code} (${appliedCoupon.discount}% OFF)`;
      message += `\nDiscount: -₹${discountAmount}`;
    }
    message += `\nTotal: ₹${total}\n\nThank you 💖`;
    window.open(`https://wa.me/919261151400?text=${encodeURIComponent(message)}`, "_blank");
  };

  /* ---------- SUCCESS SCREEN ---------- */
  if (step === "success") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-card-hover p-10 text-center max-w-md w-full"
        >
          <div className="text-7xl mb-4 animate-bounce-in">🎉</div>
          <h2 className="text-2xl font-bold text-dark mb-2">Order Placed!</h2>
          <p className="text-muted text-sm mb-4">Thank you for shopping with MITWA Collection 💖</p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
            <p className="text-green-700 text-sm font-medium">✅ Order confirmed for ₹{total}</p>
            {orderId && <p className="text-green-500 text-xs mt-1">Ref: {String(orderId).slice(-8).toUpperCase()}</p>}
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/orders")} className="btn-primary w-full py-3">
              View My Orders 📦
            </button>
            <button onClick={() => navigate("/products")} className="btn-secondary w-full py-3">
              Continue Shopping 🛍️
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---------- ADDRESS SCREEN ---------- */
  if (step === "address") {
    return (
      <div className="min-h-screen bg-bg p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep("cart")} className="flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>

          <h2 className="text-2xl font-bold text-dark mb-6">📍 Delivery Address</h2>

          <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
            {[
              { label: "Full Name", key: "name", placeholder: "Receiver's name", icon: "👤" },
              { label: "Street / Flat / Colony", key: "street", placeholder: "123, Main Street, Colony", icon: "🏠" },
              { label: "City", key: "city", placeholder: "Udaipur", icon: "🏙️" },
              { label: "Pincode", key: "pincode", placeholder: "313001", icon: "📮" },
              { label: "Phone", key: "phone", placeholder: "10-digit number", icon: "📱" },
            ].map(({ label, key, placeholder, icon }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{icon} {label}</label>
                <input
                  className="input-field"
                  placeholder={placeholder}
                  maxLength={key === "phone" || key === "pincode" ? 10 : undefined}
                  value={address[key]}
                  onChange={(e) => setAddress({ ...address, [key]: key === "phone" ? e.target.value.replace(/\D/g, "") : e.target.value })}
                />
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-card p-5 mt-4">
            <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-50 last:border-0">
                <span>{item.name} × {item.qty}</span>
                <span className="font-medium">₹{item.price * item.qty}</span>
              </div>
            ))}
            <div className="flex justify-between mt-3 pt-2 border-t">
              <span className="font-bold text-dark">Total</span>
              <span className="font-bold text-primary text-lg">₹{total}</span>
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={isPlacingOrder} className={`btn-primary w-full py-4 text-base mt-4 ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isPlacingOrder ? "Placing Order..." : "Place Order 📦"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- CART SCREEN ---------- */
  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6">
          Your Cart 🛒
          <span className="text-sm font-normal text-muted ml-2">({cart.length} {cart.length === 1 ? "item" : "items"})</span>
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-card">
            <div className="text-7xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-muted text-sm mb-6">Add some beautiful items for your little ones!</p>
            <button onClick={() => navigate("/products")} className="btn-primary px-8 py-3">
              Start Shopping 🛍️
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-3">
              <AnimatePresence>
                {cart.map((item, i) => {
                  const imgSrc = item.image?.startsWith("http") ? item.image : `${API_URL}${item.image}`;
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white p-4 rounded-2xl shadow-card flex gap-4 items-center"
                    >
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
                        <p className="text-primary font-bold">₹{item.price}</p>
                        {item.qty >= item.stock && (
                          <p className="text-red-400 text-xs mt-0.5">Max stock reached ⚠️</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => decreaseQty(item._id)} className="w-8 h-8 bg-gray-100 hover:bg-pink-100 hover:text-primary rounded-full flex items-center justify-center text-gray-600 transition-colors font-bold">−</button>
                        <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                        <button onClick={() => increaseQty(item)} className="w-8 h-8 bg-gray-100 hover:bg-pink-100 hover:text-primary rounded-full flex items-center justify-center text-gray-600 transition-colors font-bold">+</button>
                        <button onClick={() => removeFromCart(i)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-full flex items-center justify-center transition-colors ml-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Coupon */}
              <div className="bg-white p-5 rounded-2xl shadow-card">
                <p className="font-semibold text-gray-800 mb-3">🎟️ Have a coupon?</p>
                <div className="flex gap-2">
                  <input
                    placeholder="Enter coupon code (NEWUSER10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button onClick={applyCoupon} className="btn-primary px-5 py-2.5 shrink-0">Apply</button>
                </div>
                {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                {appliedCoupon && (
                  <div className="flex items-center gap-2 mt-2 bg-green-50 rounded-xl px-3 py-2">
                    <span className="text-green-600 text-sm font-semibold">✅ {appliedCoupon.code} — {appliedCoupon.discount}% OFF applied!</span>
                  </div>
                )}
                <p className="text-xs text-muted mt-2">Try: NEWUSER10 | MITWA20</p>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:w-80 space-y-4">
              <div className="bg-white p-5 rounded-2xl shadow-card sticky top-20">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span className="font-medium">−₹{discountAmount} 🎁</span>
                    </div>
                  )}
                  <div className="flex justify-between text-green-600 text-xs">
                    <span>Delivery</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg text-dark">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                  <button
                    onClick={handleProceedToAddress}
                    className="btn-primary w-full py-3.5 font-semibold"
                  >
                    {user ? "Proceed to Order 📦" : "Login to Order 🔐"}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-3.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order on WhatsApp
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted">
                  <span>🔒 Secure</span>
                  <span>📦 Fast Delivery</span>
                  <span>💯 Quality</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
