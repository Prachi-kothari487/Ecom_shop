import express from "express";
import OfflineBill from "../models/OfflineBill.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create bill — admin/staff only
router.post("/", protect, adminMiddleware, async (req, res) => {
  try {
    const { items } = req.body;

    // Reduce stock for each item
    for (const item of items) {
      if (!item._id) continue;
      const product = await Product.findById(item._id).catch(() => null);
      if (!product) continue;
      if (product.stock != null && product.stock < item.qty) {
        return res.status(400).json({ msg: `Only ${product.stock} left for ${item.name}` });
      }
      if (product.stock != null) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    const bill = await OfflineBill.create({
      ...req.body,
      billNumber: "MITWA-" + Date.now(),
    });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all bills — admin/staff only
router.get("/", protect, adminMiddleware, async (req, res) => {
  try {
    const bills = await OfflineBill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get single bill
router.get("/:id", async (req, res) => {
  try {
    const bill = await OfflineBill.findById(req.params.id);
    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update bill
router.put("/:id", async (req, res) => {
  try {
    const updated = await OfflineBill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
