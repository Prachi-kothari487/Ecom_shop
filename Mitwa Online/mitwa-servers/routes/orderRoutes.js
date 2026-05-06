import express from "express";
import {
  createOrder,
  getOrders,
  getOnlineOrders,
  getOfflineOrders,
  updateOrderStatus,
  updateOrder
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);  // login required
router.get("/", getOrders);
router.get("/online", getOnlineOrders);
router.get("/offline", getOfflineOrders);
router.put("/:id/deliver", updateOrderStatus);
router.put("/:id", updateOrder);

export default router;
