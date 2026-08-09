import { useEffect, useState, useRef } from "react";
import API from "../utils/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [discountType, setDiscountType] = useState("percent"); // percent | flat
  const [discountValue, setDiscountValue] = useState("");
  const [generatedBill, setGeneratedBill] = useState(null);
  const searchRef = useRef(null);
  const printRef = useRef(null);

  useEffect(() => {
    Promise.all([
      API.get("/api/products"),
      API.get("/api/categories"),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data);
      setCategories(catRes.data);
    });
    // Focus search on load
    setTimeout(() => searchRef.current?.focus(), 100);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const addToCart = (product) => {
    if (product.stock === 0) { toast.error("Out of stock!"); return; }
    const existing = cart.find((i) => i._id === product._id);
    if (existing) {
      if (existing.qty >= product.stock) { toast.error(`Only ${product.stock} available`); return; }
      setCart(cart.map((i) => i._id === product._id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    toast.success(`${product.name} added ✅`, { duration: 1000 });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) { setCart(cart.filter((i) => i._id !== id)); return; }
    const item = cart.find((i) => i._id === id);
    if (item && qty > item.stock) { toast.error(`Only ${item.stock} available`); return; }
    setCart(cart.map((i) => i._id === id ? { ...i, qty } : i));
  };

  const removeItem = (id) => setCart(cart.filter((i) => i._id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = (() => {
    const val = Number(discountValue) || 0;
    if (!val) return 0;
    if (discountType === "percent") return Math.round((subtotal * val) / 100);
    return Math.min(val, subtotal);
  })();
  const total = subtotal - discountAmount;

  const generateBill = async () => {
    if (!phone || phone.length !== 10) { toast.error("Enter valid 10-digit phone ❌"); return; }
    if (cart.length === 0) { toast.error("Cart is empty ❌"); return; }

    try {
      const res = await API.post("/api/offline-bills", {
        customerName: customerName || "Walk-in Customer",
        phone,
        items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty, total: i.price * i.qty })),
        subtotal,
        discount: Number(discountValue) || 0,
        discountAmount,
        total,
      });
      setGeneratedBill(res.data);
      toast.success("Bill Generated ✅");
    } catch (err) {
      toast.error("Bill failed ❌ " + (err.response?.data?.msg || err.message));
    }
  };

  const printBill = () => {
    if (!generatedBill) return;
    const content = printRef.current?.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Bill - MITWA</title>
      <style>
        body { font-family: monospace; padding: 20px; max-width: 320px; margin: 0 auto; }
        h2 { text-align: center; margin-bottom: 4px; }
        p { margin: 2px 0; font-size: 13px; }
        .line { border-top: 1px dashed #000; margin: 6px 0; }
        .row { display: flex; justify-content: space-between; font-size: 13px; }
        .bold { font-weight: bold; }
        .center { text-align: center; }
      </style></head><body>
      <h2>MITWA COLLECTION</h2>
      <p class="center" style="font-size:11px">Sindhi Bazar, Udaipur | 9261151400</p>
      <div class="line"></div>
      <p>Bill No: ${generatedBill.billNumber}</p>
      <p>Customer: ${generatedBill.customerName}</p>
      <p>Phone: ${generatedBill.phone}</p>
      <p>Date: ${new Date().toLocaleString("en-IN")}</p>
      <div class="line"></div>
      ${generatedBill.items.map((i) => `<div class="row"><span>${i.name} x${i.qty}</span><span>₹${i.total}</span></div>`).join("")}
      <div class="line"></div>
      <div class="row"><span>Subtotal</span><span>₹${generatedBill.subtotal || subtotal}</span></div>
      ${discountAmount ? `<div class="row"><span>Discount</span><span>-₹${generatedBill.discountAmount || discountAmount}</span></div>` : ""}
      <div class="row bold"><span>TOTAL</span><span>₹${generatedBill.total}</span></div>
      <div class="line"></div>
      <p class="center" style="font-size:11px">Thank you for shopping! 💖</p>
      <p class="center" style="font-size:10px">@mitwacollectionudaipur</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const sendWhatsApp = (bill) => {
    let text = `🧾 *MITWA COLLECTION*\n\nBill No: ${bill.billNumber}\nCustomer: ${bill.customerName}\n\n`;
    bill.items.forEach((i) => { text += `${i.name} x${i.qty} = ₹${i.total}\n`; });
    if (discountAmount) text += `\nDiscount: -₹${bill.discountAmount || discountAmount}`;
    text += `\n\nTotal: ₹${bill.total}\n\nThank you ❤️`;
    window.open(`https://wa.me/91${bill.phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const resetBill = () => { setCart([]); setCustomerName(""); setPhone(""); setDiscountValue(""); setGeneratedBill(null); searchRef.current?.focus(); };

  // Keyboard shortcut: Enter in search
  const handleSearchKey = (e) => {
    if (e.key === "Enter" && filteredProducts.length === 1) {
      addToCart(filteredProducts[0]);
      setSearch("");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-dark">POS — Create Bill 🖥️</h2>
        <p className="text-xs text-muted">Tip: Type a product name and press Enter to quick-add</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-140px)]">
        {/* LEFT: Products */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl shadow-card">
          {/* Search + Category */}
          <div className="p-4 border-b space-y-2">
            <input
              ref={searchRef}
              placeholder="🔍 Search products (Enter to quick-add)..."
              className="input-field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
            />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategoryFilter("")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${!categoryFilter ? "bg-hero-gradient text-white" : "bg-gray-100 text-gray-600"}`}
              >All</button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setCategoryFilter(c.name === categoryFilter ? "" : c.name)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${categoryFilter === c.name ? "bg-hero-gradient text-white" : "bg-gray-100 text-gray-600 hover:bg-pink-50"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map((p) => {
                const imgSrc = p.image?.startsWith("http") ? p.image : `${API_URL}${p.image}`;
                const inCart = cart.find((i) => i._id === p._id);
                return (
                  <button
                    key={p._id}
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                    className={`bg-white border-2 rounded-xl overflow-hidden text-left transition-all hover:border-primary hover:shadow-card ${inCart ? "border-primary bg-pink-50" : "border-gray-100"} ${p.stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <img src={imgSrc} alt={p.name} className="w-full h-24 object-cover" />
                    <div className="p-2">
                      <p className="text-xs font-semibold text-dark truncate">{p.name}</p>
                      <p className="text-primary font-bold text-sm">₹{p.price}</p>
                      {inCart && <p className="text-xs text-secondary font-medium">In cart: {inCart.qty}</p>}
                      {p.stock === 0 && <p className="text-xs text-red-400">Out of stock</p>}
                    </div>
                  </button>
                );
              })}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-muted">
                <div className="text-4xl mb-2">🔍</div>
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Cart + Bill */}
        <div className="w-80 bg-white rounded-2xl shadow-card flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b bg-dark-gradient">
            <h3 className="font-bold text-white text-lg">Bill 🧾</h3>
          </div>

          <div className="p-4 space-y-2 border-b">
            <input
              placeholder="Customer Name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input-field text-sm py-2"
            />
            <input
              placeholder="Phone (10 digit) *"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="input-field text-sm py-2"
              maxLength={10}
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">
                <div className="text-3xl mb-2">🛒</div>
                Click products to add
              </div>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark truncate">{item.name}</p>
                    <p className="text-xs text-primary font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-6 h-6 bg-white border rounded-full flex items-center justify-center text-xs font-bold hover:bg-pink-50 hover:text-primary transition-colors">−</button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, parseInt(e.target.value) || 0)}
                      className="w-10 text-center text-xs border rounded-lg py-1 font-bold"
                      min={0}
                    />
                    <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-6 h-6 bg-white border rounded-full flex items-center justify-center text-xs font-bold hover:bg-pink-50 hover:text-primary transition-colors">+</button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">₹{item.price * item.qty}</p>
                    <button onClick={() => removeItem(item._id)} className="text-red-400 text-xs hover:text-red-600">✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount + Totals */}
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-2">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="input-field text-xs py-2 w-24"
              >
                <option value="percent">% Off</option>
                <option value="flat">₹ Flat</option>
              </select>
              <input
                type="number"
                placeholder={discountType === "percent" ? "e.g. 10" : "e.g. 50"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="input-field text-xs py-2 flex-1"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 text-xs">
                  <span>Discount</span><span>−₹{discountAmount}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span><span className="text-primary">₹{total}</span>
              </div>
            </div>

            {/* Generate Bill */}
            {!generatedBill ? (
              <button
                onClick={generateBill}
                disabled={cart.length === 0}
                className="btn-primary w-full py-3 font-semibold disabled:opacity-50"
              >
                Generate Bill 🧾
              </button>
            ) : (
              <>
                {/* Bill Preview */}
                <div ref={printRef} className="bg-gray-50 rounded-xl p-3 text-xs border border-dashed font-mono">
                  <p className="font-bold text-center text-sm">MITWA COLLECTION</p>
                  <p className="text-center text-gray-500">Sindhi Bazar, Udaipur</p>
                  <hr className="border-dashed my-1" />
                  <p>Bill: {generatedBill.billNumber}</p>
                  <p>Customer: {generatedBill.customerName}</p>
                  <p>Phone: {generatedBill.phone}</p>
                  <hr className="border-dashed my-1" />
                  {generatedBill.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.name} x{i.qty}</span>
                      <span>₹{i.total}</span>
                    </div>
                  ))}
                  <hr className="border-dashed my-1" />
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>TOTAL</span><span>₹{generatedBill.total}</span>
                  </div>
                  <p className="text-center mt-1 text-gray-500">Thank you! 💖</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button onClick={printBill} className="bg-blue-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-600">🖨️ Print</button>
                  <button onClick={() => sendWhatsApp(generatedBill)} className="bg-green-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-green-600">📱 WA</button>
                  <button onClick={resetBill} className="bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold hover:bg-gray-300">🔄 New</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
