import { useEffect, useState } from "react";
import { COUPONS } from "../data/coupons";

const popupCoupon = COUPONS[0]; // NEWUSER10

export default function CouponPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show popup to admin/staff
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin" || user?.role === "staff";
    if (isAdmin) return;

    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(popupCoupon.code);
    alert("Copied! 🎉");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl text-center relative max-w-sm w-full mx-4">
        <button onClick={() => setShow(false)} className="absolute top-2 right-3 text-gray-500">❌</button>
        <h2 className="text-2xl font-bold mb-2">🎁 Get {popupCoupon.discount}% OFF</h2>
        <p className="text-gray-600 mb-3">Use Code:</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-bold text-pink-500 text-xl bg-pink-50 px-4 py-2 rounded-lg">
            {popupCoupon.code}
          </span>
          <button onClick={copyCode} className="bg-gray-100 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">
            Copy 📋
          </button>
        </div>
        <a href="/products" onClick={() => setShow(false)}
          className="bg-pink-500 text-white px-6 py-2 rounded-full hover:scale-105 transition inline-block">
          Shop Now
        </a>
      </div>
    </div>
  );
}
