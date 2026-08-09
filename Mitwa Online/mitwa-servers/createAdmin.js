import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// Check if admin already exists
const existing = await User.findOne({ role: "admin" });

if (existing) {
  console.log("✅ Admin already exists:", existing.email);
  console.log("Use resetAdmin.js to reset password if needed.");
} else {
  const hashed = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin",
    email: "admin@mitwa.com",
    password: hashed,
    phone: "9261151400",
    role: "admin",
    active: true,
  });
  console.log("✅ Admin created successfully!");
  console.log("📧 Email:    admin@mitwa.com");
  console.log("🔑 Password: admin123");
}

await mongoose.disconnect();
