import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Order from "../models/Order.js";
import OfflineBill from "../models/OfflineBill.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ✅ Admin Stats
router.get("/stats", protect, adminMiddleware, async (req, res) => {
  try {
    const [onlineOrders, offlineBills, products, customers] = await Promise.all([
      Order.find({ type: "online" }),
      OfflineBill.find(),
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
    ]);

    const onlineRevenue = onlineOrders.reduce((s, o) => s + (o.total || 0), 0);
    const offlineRevenue = offlineBills.reduce((s, b) => s + (b.total || 0), 0);

    res.json({
      onlineRevenue,
      offlineRevenue,
      onlineOrders: onlineOrders.length,
      offlineBills: offlineBills.length,
      products,
      customers,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET ALL STAFF
router.get("/staff", protect, adminMiddleware, async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");
    res.json(staff);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ADD STAFF
router.post("/staff", protect, adminMiddleware, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const staff = await User.create({ name, email, password: hashed, phone, role: "staff" });
    res.json({ msg: "Staff added", staff });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// TOGGLE ACTIVE STATUS
router.put("/staff/:id/toggle", protect, adminMiddleware, async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    staff.active = !staff.active;
    await staff.save();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE STAFF
router.delete("/staff/:id", protect, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
