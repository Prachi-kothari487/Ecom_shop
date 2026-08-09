import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const newPassword = "Mitwa@2005";
const hashed = await bcrypt.hash(newPassword, 10);

const result = await User.updateOne(
  { email: "prachikothari2005@gmail.com" },
  { $set: { password: hashed, role: "admin", active: true } }
);

if (result.matchedCount) {
  console.log("✅ Password reset successfully!");
  console.log("📧 Email:    prachikothari2005@gmail.com");
  console.log("🔑 Password: Mitwa@2005");
} else {
  console.log("❌ User not found. Creating new admin...");
  const hashed2 = await bcrypt.hash(newPassword, 10);
  await User.create({
    name: "Prachi Kothari",
    email: "prachikothari2005@gmail.com",
    password: hashed2,
    phone: "9261151400",
    role: "admin",
    active: true,
  });
  console.log("✅ Admin created!");
  console.log("📧 Email:    prachikothari2005@gmail.com");
  console.log("🔑 Password: Mitwa@2005");
}

await mongoose.disconnect();
process.exit(0);
