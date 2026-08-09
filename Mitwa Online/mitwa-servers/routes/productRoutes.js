import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { getProducts } from "../controllers/productController.js";
import Product from "../models/Product.js";

// Use memory storage — no disk needed
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Add product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file ? req.file.originalname : "NO FILE");

    let imageUrl = "";

    if (req.file) {
      // Upload buffer directly to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "mitwa-products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const product = await Product.create({
      ...req.body,
      image: imageUrl,
    });

    res.json(product);
  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err.message);
    res.status(500).json({ msg: err.message });
  }
});

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (stock, price, etc.)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
