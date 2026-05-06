import express from "express";
import multer from "multer";
import { addProduct, getProducts } from "../controllers/productController.js";
import Product from "../models/Product.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("image"), addProduct);
router.get("/", getProducts);
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
