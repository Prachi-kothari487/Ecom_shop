import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  phone: String,
  items: Array,
  total: Number,
  status: {
    type: String,
    default: "pending"
  },
  type: {
    type: String,
    default: "online"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
