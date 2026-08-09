import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: String,
  discountPercent: Number,
  minOrder: Number,
  expiryDate: Date,
  active: { type: Boolean, default: true },
});

export default mongoose.model("Coupon", couponSchema);
