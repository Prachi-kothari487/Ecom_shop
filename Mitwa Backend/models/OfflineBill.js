import mongoose from "mongoose";

const offlineBillSchema = new mongoose.Schema(
  {
    customerName: String,
    phone: String,
    items: [
      {
        name: String,
        price: Number,
        qty: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    total: Number,
    paymentMethod: { type: String, default: "cash" },
    billNumber: String,
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("OfflineBill", offlineBillSchema);
