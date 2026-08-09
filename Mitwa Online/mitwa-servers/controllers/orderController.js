import Order from "../models/Order.js";
import Product from "../models/Product.js";
import jwt from "jsonwebtoken";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // Check & reduce stock
    for (let item of items) {
      if (!item._id) continue;
      const product = await Product.findById(item._id).catch(() => null);
      if (!product) continue;
      if (product.stock == null) continue;
      const qty = item.qty || 1;
      if (product.stock < qty) {
        return res.status(400).json({ msg: `Only ${product.stock} available for ${product.name}` });
      }
      product.stock -= qty;
      await product.save();
    }

    const order = await Order.create(req.body);
    res.json(order);
  } catch (err) {
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

// Get Online Orders (admin)
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

// ✅ NEW: Get orders for logged-in user (by userId = user.name or user.email)
export const getMyOrders = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const identifier = req.user?.name || req.user?.email;
    const orders = await Order.find({
      type: "online",
      $or: [{ userId: identifier }],
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Order Status (deliver only)
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

// Update Order (edit items/status/anything)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};
