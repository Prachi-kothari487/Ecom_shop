import express from "express";
import {
  createOrder,
  getOrders,
  getOnlineOrders,
  getOfflineOrders,
  updateOrderStatus,
  updateOrder,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", getOrders);
router.get("/online", getOnlineOrders);
router.get("/offline", getOfflineOrders);
router.get("/my", protect, getMyOrders);   // ✅ user-specific orders
router.put("/:id/deliver", updateOrderStatus);
router.put("/:id", updateOrder);

export default router;
