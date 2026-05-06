import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { COUPONS } from "../data/coupons";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { user } = useAuth();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

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
  };

  const getToken = () => JSON.parse(localStorage.getItem("user"))?.token;

  const checkAuth = () => {
    if (!user || !getToken()) {
      alert("Please login to continue 🔐");
      window.location.href = "/login?redirect=cart";
      return false;
    }
    return true;
  };

  const handleOrder = async () => {
    if (!checkAuth()) return;
    try {
      const token = getToken();
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          userId: user?.name || user?.email || "guest",
          phone: user?.phone || "",
          items: cart,
          total,
          type: "online"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (appliedCoupon) localStorage.setItem(appliedCoupon.code, "used");
      alert("Order placed! 🎉");
    } catch (err) {
      alert(err.response?.data?.msg || "Order failed ❌");
    }
  };

  const handleWhatsApp = () => {
    if (!checkAuth()) return;
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

  return (
    <div className="p-8 bg-bg min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">No items yet 😅</p>
      ) : (
        <>
          {/* ITEMS */}
          {cart.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow mb-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-primary font-bold">
                  ₹{item.price} x {item.qty} = ₹{item.price * item.qty}
                </p>
                {item.qty >= item.stock && (
                  <p className="text-red-500 text-xs">Only {item.stock} available ❌</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQty(item._id)} className="bg-gray-200 px-2 rounded">➖</button>
                <span className="font-bold w-6 text-center">{item.qty}</span>
                <button onClick={() => increaseQty(item)} className="bg-gray-200 px-2 rounded">➕</button>
                <button onClick={() => removeFromCart(i)} className="text-red-400 ml-2">❌</button>
              </div>
            </div>
          ))}

          {/* COUPON */}
          <div className="bg-white p-4 rounded-xl shadow mt-4">
            <p className="font-semibold mb-2">Have a coupon? 🎟️</p>
            <div className="flex gap-2">
              <input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <button onClick={applyCoupon} className="bg-black text-white px-4 rounded-full">
                Apply
              </button>
            </div>
            {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-green-600 text-sm mt-2">
                ✅ {appliedCoupon.code} applied — {appliedCoupon.discount}% OFF!
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">Try: NEWUSER10 | MITWA20</p>
          </div>

          {/* BILL SUMMARY */}
          <div className="bg-white p-4 rounded-xl shadow mt-4 space-y-1">
            <p className="text-gray-600">Subtotal: ₹{subtotal}</p>
            {appliedCoupon && (
              <p className="text-green-600 font-medium">
                Discount ({appliedCoupon.discount}%): -₹{discountAmount} 🎁
              </p>
            )}
            <h3 className="font-bold text-xl border-t pt-2">Total: ₹{total}</h3>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleOrder}
              disabled={!user}
              className={`flex-1 py-3 rounded-full transition ${
                user ? "bg-primary text-white hover:scale-105" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {user ? "Place Order 📦" : "Login to Order 🔐"}
            </button>
            <button onClick={handleWhatsApp} className="flex-1 bg-green-500 text-white py-3 rounded-full hover:scale-105 transition">
              Order on WhatsApp 📱
            </button>
          </div>
        </>
      )}
    </div>
  );
}
