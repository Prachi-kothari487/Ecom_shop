import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  ageMin: Number,
  ageMax: Number,
  gender: {
    type: String,
    enum: ["boys", "girls"]
  },
  stock: {
    type: Number,
    default: 1
  },
  image: String,
  description: String
});

export default mongoose.model("Product", productSchema);
