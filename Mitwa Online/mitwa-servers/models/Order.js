import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  phone: String,
  items: Array,
  total: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  type: {
    type: String,
    default: "online"
  },
  address: {
    street: String,
    city: String,
    pincode: String,
  },
  coupon: String,
  requestId: {
    type: String,
    unique: true,
    sparse: true
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
