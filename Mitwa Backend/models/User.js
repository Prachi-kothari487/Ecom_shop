import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ["admin", "staff", "customer"],
    default: "customer"
  },
  active: { type: Boolean, default: true },
  lastLogin: Date,
  totalSales: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
