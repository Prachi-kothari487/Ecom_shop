import { useEffect, useState } from "react";
import axios from "axios";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => setProducts(res.data));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => setCart([...cart, product]);

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const placeOrder = async () => {
    if (!phone || phone.length !== 10) {
      alert("Enter valid 10-digit phone number ❌");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty ❌");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/orders", {
        userId: customer || "Walk-in Customer",
        phone,
        items: cart,
        total,
        type: "offline"
      });
      console.log("Order saved:", res.data);
      alert("Bill Generated ✅");

      // Auto WhatsApp
      let message = `🧾 *MITWA COLLECTION*\n\nCustomer: ${customer || "Walk-in"}\n\n`;
      cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} - ₹${item.price}\n`;
      });
      message += `\nTotal: ₹${total}\n\nThank you 💖`;
      window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, "_blank");

      setCart([]);
      setCustomer("");
      setPhone("");
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
      alert("Failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* PRODUCTS */}
      <div className="w-2/3 p-6">
        <h2 className="text-2xl font-bold mb-4">Products 🛍️</h2>
        <input
          placeholder="Search products 🔍"
          className="border p-2 mb-4 w-full rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((p, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow">
              <img
                src={p.image?.startsWith("http") ? p.image : `http://localhost:5000/${p.image}`}
                className="h-32 w-full object-cover rounded"
                alt={p.name}
              />
              <h3 className="font-semibold mt-2">{p.name}</h3>
              <p className="text-primary font-bold">₹{p.price}</p>
              <button
                onClick={() => addToCart(p)}
                className="bg-primary text-white px-2 py-1 mt-2 rounded-full w-full"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="w-1/3 bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cart 🛒</h2>

        <input
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          placeholder="Customer Phone (10 digit)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        {cart.length === 0 && <p className="text-gray-400">No items added</p>}

        {cart.map((item, i) => (
          <div key={i} className="flex justify-between items-center mb-2">
            <span className="text-sm">{item.name}</span>
            <span className="text-sm font-semibold">₹{item.price}</span>
            <button onClick={() => removeItem(i)} className="text-red-400 text-sm">❌</button>
          </div>
        ))}

        <hr className="my-4" />
        <h3 className="font-bold text-lg">Total: ₹{total}</h3>

        <button
          onClick={placeOrder}
          disabled={cart.length === 0}
          className="bg-green-500 text-white w-full py-2 mt-4 rounded-full disabled:opacity-50"
        >
          Generate Bill 🧾
        </button>
      </div>

    </div>
  );
}
