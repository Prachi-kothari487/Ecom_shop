import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // Check & reduce stock
    for (let item of items) {
      if (!item._id) continue;

      const product = await Product.findById(item._id).catch(() => null);
      if (!product) continue;

      // skip stock check if stock not set (old products)
      if (product.stock == null) continue;

      const qty = item.qty || 1;

      if (product.stock < qty) {
        return res.status(400).json({ msg: `Only ${product.stock} available for ${product.name}` });
      }

      product.stock -= qty;
      await product.save();
    }

    const order = await Order.create(req.body);
    console.log("Order saved:", order._id, "type:", order.type);
    res.json(order);
  } catch (err) {
    console.log("createOrder error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Online Orders
export const getOnlineOrders = async (req, res) => {
  try {
    const orders = await Order.find({ type: "online" }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Offline Orders
export const getOfflineOrders = async (req, res) => {
  try {
    const orders = await Order.find({ type: "offline" }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "delivered" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Order (edit items/qty)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Update failed" });
  }
};
