import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const used = localStorage.getItem("couponUsed");
    if (!used) {
      setDiscount(10);
    }
  }, []);

  const applyCoupon = () => {
    const used = localStorage.getItem("couponUsed");
    if (!used) {
      setDiscount(10);
      localStorage.setItem("couponUsed", "true");
    } else {
      alert("Coupon already used ❌");
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      if (existing.qty >= product.stock) {
        alert(`Only ${product.stock} items available ❌`);
        return;
      }
      setCart(cart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (product) => {
    setCart(cart.map((item) => {
      if (item._id === product._id) {
        if (item.qty >= item.stock) {
          alert(`Only ${item.stock} available`);
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    }));
  };

  const decreaseQty = (id) => {
    setCart(cart
      .map((item) => item._id === id ? { ...item, qty: item.qty - 1 } : item)
      .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  const total = subtotal - discountAmount;

  return (
    <CartContext.Provider value={{
      cart, addToCart, increaseQty, decreaseQty, removeFromCart,
      discount, discountAmount, subtotal, total, applyCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}
