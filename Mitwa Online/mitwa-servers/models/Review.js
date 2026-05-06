import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: String,
  message: String,
  rating: Number
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
